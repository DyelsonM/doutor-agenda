/**
 * Processador OpenCL para cálculos estatísticos paralelos
 * 
 * Este módulo utiliza OpenCL para processar cálculos estatísticos do dashboard
 * em paralelo, aproveitando vários núcleos da CPU.
 * 
 * Requisitos:
 * - Drivers OpenCL instalados (Intel/AMD/NVIDIA)
 * - Biblioteca node-opencl compilada e instalada
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cl: any = null;

/**
 * Inicializa o contexto OpenCL
 */
async function initializeOpenCL() {
  if (cl) {
    return cl;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cl = require("node-opencl");
    return cl;
  } catch (error) {
    throw new Error(
      "OpenCL não está disponível. Certifique-se de que node-opencl está instalado e os drivers OpenCL estão configurados.",
    );
  }
}

interface DailyAppointmentData {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface StatsProcessingParams {
  dailyData: DailyAppointmentData[];
  startDate: Date;
  endDate: Date;
}

interface ProcessedStats {
  totalRevenue: number;
  totalAppointments: number;
  averageDailyRevenue: number;
  averageDailyAppointments: number;
  peakDay: DailyAppointmentData | null;
}

/**
 * Processa estatísticas usando OpenCL em paralelo
 */
export async function processStatsParallel(
  params: StatsProcessingParams,
): Promise<ProcessedStats> {
  const { dailyData } = params;

  if (dailyData.length === 0) {
    return {
      totalRevenue: 0,
      totalAppointments: 0,
      averageDailyRevenue: 0,
      averageDailyAppointments: 0,
      peakDay: null,
    };
  }

  try {
    const cl = await initializeOpenCL();

    // Obter plataforma e dispositivo (CPU)
    const platforms = cl.getPlatformIDs();
    if (platforms.length === 0) {
      throw new Error("Nenhuma plataforma OpenCL encontrada");
    }

    const platform = platforms[0];
    // Tentar obter dispositivos CPU, se não houver, usar todos os dispositivos
    let devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_CPU);
    
    if (devices.length === 0) {
      // Fallback: tentar todos os dispositivos e filtrar CPU manualmente
      const allDevices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL);
      devices = allDevices.filter((device: any) => {
        const deviceType = cl.getDeviceInfo(device, cl.DEVICE_TYPE);
        return deviceType === cl.DEVICE_TYPE_CPU;
      });
    }

    if (devices.length === 0) {
      throw new Error("Nenhum dispositivo CPU OpenCL encontrado");
    }

    const device = devices[0];

    // Criar contexto e fila de comandos
    const context = cl.createContext([device]);
    const queue = cl.createCommandQueue(context, device, 0);

    // Preparar dados
    const revenues = dailyData.map((d) => d.revenue || 0);
    const appointments = dailyData.map((d) => d.appointments);

    // Kernel OpenCL para calcular somas e encontrar pico
    const kernelSource = `
      __kernel void calculateStats(
        __global const float* revenues,
        __global const int* appointments,
        __global float* results,
        const int dataCount
      ) {
        int id = get_global_id(0);
        
        if (id == 0) {
          // Calcular totais
          float totalRevenue = 0.0f;
          int totalAppointments = 0;
          
          for (int i = 0; i < dataCount; i++) {
            totalRevenue += revenues[i];
            totalAppointments += appointments[i];
          }
          
          results[0] = totalRevenue;
          results[1] = (float)totalAppointments;
          results[2] = totalRevenue / (float)dataCount; // média receita
          results[3] = (float)totalAppointments / (float)dataCount; // média agendamentos
        }
        
        // Encontrar dia de pico (maior receita)
        if (id < dataCount) {
          float maxRevenue = 0.0f;
          int maxIndex = 0;
          
          for (int i = 0; i < dataCount; i++) {
            if (revenues[i] > maxRevenue) {
              maxRevenue = revenues[i];
              maxIndex = i;
            }
          }
          
          results[4] = (float)maxIndex; // índice do dia de pico
        }
      }
    `;

    // Compilar programa
    const program = cl.createProgramWithSource(context, kernelSource);
    try {
      cl.buildProgram(program);
    } catch (error) {
      const buildLog = cl.getProgramBuildInfo(
        program,
        device,
        cl.PROGRAM_BUILD_LOG,
      );
      throw new Error(`Erro ao compilar kernel OpenCL: ${buildLog}`);
    }

    const kernel = cl.createKernel(program, "calculateStats");

    // Criar buffers
    const revenuesBuffer = cl.createBuffer(
      context,
      cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR,
      new Float32Array(revenues),
    );
    const appointmentsBuffer = cl.createBuffer(
      context,
      cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR,
      new Int32Array(appointments),
    );
    const resultsBuffer = cl.createBuffer(
      context,
      cl.MEM_WRITE_ONLY,
      5 * Float32Array.BYTES_PER_ELEMENT, // 5 valores de resultado
    );

    // Configurar argumentos do kernel
    cl.setKernelArg(kernel, 0, "pointer", revenuesBuffer);
    cl.setKernelArg(kernel, 1, "pointer", appointmentsBuffer);
    cl.setKernelArg(kernel, 2, "pointer", resultsBuffer);
    cl.setKernelArg(kernel, 3, "int", dailyData.length);

    // Executar kernel em paralelo
    const workSize = Math.max(1, dailyData.length);
    cl.enqueueNDRangeKernel(queue, kernel, 1, null, [workSize], null);
    cl.finish(queue);

    // Ler resultados
    const results = new Float32Array(5);
    cl.enqueueReadBuffer(
      queue,
      resultsBuffer,
      true,
      0,
      results.byteLength,
      results,
    );

    // Liberar recursos
    cl.releaseMemObject(revenuesBuffer);
    cl.releaseMemObject(appointmentsBuffer);
    cl.releaseMemObject(resultsBuffer);
    cl.releaseKernel(kernel);
    cl.releaseProgram(program);
    cl.releaseCommandQueue(queue);
    cl.releaseContext(context);

    const peakIndex = Math.round(results[4]);
    const peakDay =
      peakIndex >= 0 && peakIndex < dailyData.length
        ? dailyData[peakIndex]
        : null;

    return {
      totalRevenue: results[0],
      totalAppointments: Math.round(results[1]),
      averageDailyRevenue: results[2],
      averageDailyAppointments: results[3],
      peakDay,
    };
  } catch (error) {
    // Fallback para processamento sequencial se OpenCL falhar
    console.warn(
      "OpenCL não disponível, usando processamento sequencial:",
      error,
    );
    return processStatsSequential(params);
  }
}

/**
 * Processamento sequencial (fallback quando OpenCL não está disponível)
 */
function processStatsSequential(
  params: StatsProcessingParams,
): ProcessedStats {
  const { dailyData } = params;

  if (dailyData.length === 0) {
    return {
      totalRevenue: 0,
      totalAppointments: 0,
      averageDailyRevenue: 0,
      averageDailyAppointments: 0,
      peakDay: null,
    };
  }

  const totalRevenue = dailyData.reduce(
    (sum, d) => sum + (d.revenue || 0),
    0,
  );
  const totalAppointments = dailyData.reduce(
    (sum, d) => sum + d.appointments,
    0,
  );
  const averageDailyRevenue = totalRevenue / dailyData.length;
  const averageDailyAppointments = totalAppointments / dailyData.length;

  const peakDay =
    dailyData.reduce(
      (max, d) => ((d.revenue || 0) > (max.revenue || 0) ? d : max),
      dailyData[0],
    ) || null;

  return {
    totalRevenue,
    totalAppointments,
    averageDailyRevenue,
    averageDailyAppointments,
    peakDay,
  };
}

