/**
 * Processador OpenCL para verificação paralela de disponibilidade de horários
 * 
 * Este módulo utiliza OpenCL para processar a verificação de disponibilidade
 * de múltiplos slots de horário em paralelo, aproveitando vários núcleos da CPU.
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

/**
 * Converte um horário HH:mm:ss para segundos desde meia-noite
 */
function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + (seconds || 0);
}

/**
 * Converte segundos desde meia-noite para formato HH:mm:ss
 */
function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface AvailabilityCheckParams {
  timeSlots: string[];
  bookedTimes: string[];
  availableFromTime: string; // HH:mm:ss
  availableToTime: string; // HH:mm:ss
}

interface AvailabilityResult {
  time: string;
  available: boolean;
  label: string;
}

/**
 * Processa a verificação de disponibilidade usando OpenCL em paralelo
 */
export async function processAvailabilityParallel(
  params: AvailabilityCheckParams,
): Promise<AvailabilityResult[]> {
  const { timeSlots, bookedTimes, availableFromTime, availableToTime } = params;

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

    // Converter horários para segundos
    const timeSlotsSeconds = timeSlots.map(timeToSeconds);
    const bookedTimesSeconds = bookedTimes.map(timeToSeconds);
    const availableFromSeconds = timeToSeconds(availableFromTime);
    const availableToSeconds = timeToSeconds(availableToTime);

    // Kernel OpenCL para verificar disponibilidade
    const kernelSource = `
      __kernel void checkAvailability(
        __global const int* timeSlots,
        __global const int* bookedTimes,
        const int bookedCount,
        const int availableFrom,
        const int availableTo,
        __global int* results
      ) {
        int id = get_global_id(0);
        int timeSlot = timeSlots[id];
        
        // Verificar se está dentro do horário disponível
        if (timeSlot < availableFrom || timeSlot > availableTo) {
          results[id] = 0; // Não disponível
          return;
        }
        
        // Verificar se está nos horários agendados
        int isBooked = 0;
        for (int i = 0; i < bookedCount; i++) {
          if (bookedTimes[i] == timeSlot) {
            isBooked = 1;
            break;
          }
        }
        
        results[id] = isBooked == 0 ? 1 : 0; // 1 = disponível, 0 = não disponível
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

    const kernel = cl.createKernel(program, "checkAvailability");

    // Criar buffers
    const timeSlotsBuffer = cl.createBuffer(
      context,
      cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR,
      new Int32Array(timeSlotsSeconds),
    );
    const bookedTimesBuffer = cl.createBuffer(
      context,
      cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR,
      new Int32Array(bookedTimesSeconds),
    );
    const resultsBuffer = cl.createBuffer(
      context,
      cl.MEM_WRITE_ONLY,
      timeSlots.length * Int32Array.BYTES_PER_ELEMENT,
    );

    // Configurar argumentos do kernel
    cl.setKernelArg(kernel, 0, "pointer", timeSlotsBuffer);
    cl.setKernelArg(kernel, 1, "pointer", bookedTimesBuffer);
    cl.setKernelArg(kernel, 2, "int", bookedTimesSeconds.length);
    cl.setKernelArg(kernel, 3, "int", availableFromSeconds);
    cl.setKernelArg(kernel, 4, "int", availableToSeconds);
    cl.setKernelArg(kernel, 5, "pointer", resultsBuffer);

    // Executar kernel em paralelo
    cl.enqueueNDRangeKernel(
      queue,
      kernel,
      1,
      null,
      [timeSlots.length],
      null,
    );
    cl.finish(queue);

    // Ler resultados
    const results = new Int32Array(timeSlots.length);
    cl.enqueueReadBuffer(
      queue,
      resultsBuffer,
      true,
      0,
      results.byteLength,
      results,
    );

    // Liberar recursos
    cl.releaseMemObject(timeSlotsBuffer);
    cl.releaseMemObject(bookedTimesBuffer);
    cl.releaseMemObject(resultsBuffer);
    cl.releaseKernel(kernel);
    cl.releaseProgram(program);
    cl.releaseCommandQueue(queue);
    cl.releaseContext(context);

    // Converter resultados para formato esperado
    return timeSlots.map((time, index) => ({
      value: time,
      available: results[index] === 1,
      label: time.substring(0, 5),
    }));
  } catch (error) {
    // Fallback para processamento sequencial se OpenCL falhar
    console.warn(
      "OpenCL não disponível, usando processamento sequencial:",
      error,
    );
    return processAvailabilitySequential(params);
  }
}

/**
 * Processamento sequencial (fallback quando OpenCL não está disponível)
 */
function processAvailabilitySequential(
  params: AvailabilityCheckParams,
): AvailabilityResult[] {
  const { timeSlots, bookedTimes, availableFromTime, availableToTime } = params;

  const availableFromSeconds = timeToSeconds(availableFromTime);
  const availableToSeconds = timeToSeconds(availableToTime);
  const bookedTimesSet = new Set(bookedTimes);

  return timeSlots.map((time) => {
    const timeSeconds = timeToSeconds(time);
    const isInRange =
      timeSeconds >= availableFromSeconds && timeSeconds <= availableToSeconds;
    const isAvailable = isInRange && !bookedTimesSet.has(time);

    return {
      value: time,
      available: isAvailable,
      label: time.substring(0, 5),
    };
  });
}

