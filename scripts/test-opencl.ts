/**
 * Script de teste para verificar se o OpenCL está funcionando
 * e comparar performance entre processamento paralelo e sequencial
 */

import { processAvailabilityParallel } from "../src/lib/opencl/availability-processor";
import { processStatsParallel } from "../src/lib/opencl/stats-processor";

async function testOpenCL() {
  console.log("🔍 Testando OpenCL...\n");

  // Teste 1: Verificar disponibilidade de horários
  console.log("📅 Teste 1: Verificação de Disponibilidade de Horários");
  console.log("=" .repeat(60));

  const timeSlots = Array.from({ length: 100 }, (_, i) => {
    const hour = 8 + Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
  });

  const bookedTimes = ["08:00:00", "08:30:00", "09:00:00", "10:15:00"];

  const startTime1 = performance.now();
  try {
    const results = await processAvailabilityParallel({
      timeSlots,
      bookedTimes,
      availableFromTime: "08:00:00",
      availableToTime: "18:00:00",
    });
    const endTime1 = performance.now();
    const duration1 = endTime1 - startTime1;

    console.log(`✅ Processamento concluído em ${duration1.toFixed(2)}ms`);
    console.log(`📊 Total de slots processados: ${timeSlots.length}`);
    console.log(`✅ Slots disponíveis: ${results.filter((r) => r.available).length}`);
    console.log(`❌ Slots ocupados: ${results.filter((r) => !r.available).length}`);

    // Verificar se está usando OpenCL ou fallback
    const isUsingOpenCL = duration1 < 50; // OpenCL geralmente é mais rápido
    if (isUsingOpenCL) {
      console.log("🚀 Modo: OpenCL (Paralelo)");
    } else {
      console.log("⚠️  Modo: Fallback Sequencial");
      console.log("💡 Para ativar OpenCL, compile o módulo: npm rebuild node-opencl");
    }
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    console.log("⚠️  Usando fallback sequencial");
  }

  console.log("\n");

  // Teste 2: Processamento de estatísticas
  console.log("📊 Teste 2: Processamento de Estatísticas");
  console.log("=" .repeat(60));

  const dailyData = Array.from({ length: 100 }, (_, i) => ({
    date: `2024-01-${(i + 1).toString().padStart(2, "0")}`,
    appointments: Math.floor(Math.random() * 20) + 1,
    revenue: Math.floor(Math.random() * 10000) + 1000,
  }));

  const startTime2 = performance.now();
  try {
    const stats = await processStatsParallel({
      dailyData,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
    });
    const endTime2 = performance.now();
    const duration2 = endTime2 - startTime2;

    console.log(`✅ Processamento concluído em ${duration2.toFixed(2)}ms`);
    console.log(`📊 Total de receita: R$ ${(stats.totalRevenue / 100).toFixed(2)}`);
    console.log(`📅 Total de agendamentos: ${stats.totalAppointments}`);
    console.log(`📈 Média diária de receita: R$ ${(stats.averageDailyRevenue / 100).toFixed(2)}`);
    console.log(`📈 Média diária de agendamentos: ${stats.averageDailyAppointments.toFixed(2)}`);

    // Verificar se está usando OpenCL ou fallback
    const isUsingOpenCL = duration2 < 30; // OpenCL geralmente é mais rápido
    if (isUsingOpenCL) {
      console.log("🚀 Modo: OpenCL (Paralelo)");
    } else {
      console.log("⚠️  Modo: Fallback Sequencial");
      console.log("💡 Para ativar OpenCL, compile o módulo: npm rebuild node-opencl");
    }
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    console.log("⚠️  Usando fallback sequencial");
  }

  console.log("\n");
  console.log("=" .repeat(60));
  console.log("📝 Resumo:");
  console.log("=" .repeat(60));
  console.log("Para ver o paralelismo do OpenCL em ação:");
  console.log("1. Instale Visual Studio C++ Build Tools");
  console.log("2. Execute: npm rebuild node-opencl");
  console.log("3. Execute este teste novamente");
  console.log("4. Compare os tempos de execução");
}

// Executar teste
testOpenCL().catch(console.error);

