# OpenCL - Processamento Paralelo

Este diretório contém módulos para processamento paralelo usando OpenCL, aproveitando múltiplos núcleos da CPU.

## Requisitos

### 1. Drivers OpenCL

Você precisa ter os drivers OpenCL instalados no seu sistema:

- **Windows**: Instale o Intel OpenCL Runtime ou AMD OpenCL SDK
- **Linux**: Instale `opencl-headers` e `ocl-icd-opencl-dev`
- **macOS**: OpenCL já vem pré-instalado

### 2. Instalação da Biblioteca node-opencl

```bash
npm install node-opencl --legacy-peer-deps
```

**Nota**: A biblioteca `node-opencl` requer compilação nativa. Você precisará:

- **Python 3.6+** instalado e configurado
- **node-gyp** (geralmente instalado automaticamente com npm)
- **Ferramentas de build**:
  - Windows: Visual Studio Build Tools ou Visual Studio com C++
  - Linux: `build-essential`
  - macOS: Xcode Command Line Tools

### 3. Configuração do Python (Windows)

Se o Python não for encontrado automaticamente:

```bash
npm config set python "C:\Path\To\python.exe"
```

Ou defina a variável de ambiente:

```bash
set PYTHON=C:\Path\To\python.exe
```

## Módulos

### `availability-processor.ts`

Processa a verificação de disponibilidade de horários em paralelo usando OpenCL.

**Uso:**
```typescript
import { processAvailabilityParallel } from "@/lib/opencl/availability-processor";

const results = await processAvailabilityParallel({
  timeSlots: ["08:00:00", "08:30:00", ...],
  bookedTimes: ["08:00:00", "09:00:00"],
  availableFromTime: "08:00:00",
  availableToTime: "18:00:00",
});
```

### `stats-processor.ts`

Processa cálculos estatísticos do dashboard em paralelo usando OpenCL.

**Uso:**
```typescript
import { processStatsParallel } from "@/lib/opencl/stats-processor";

const stats = await processStatsParallel({
  dailyData: [
    { date: "2024-01-01", appointments: 10, revenue: 5000 },
    ...
  ],
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
});
```

## Fallback Automático

Se o OpenCL não estiver disponível ou falhar, os módulos automaticamente usam processamento sequencial como fallback. Isso garante que o sistema continue funcionando mesmo sem OpenCL configurado.

## Verificação de Instalação

Para verificar se o OpenCL está funcionando, você pode executar:

```bash
clinfo
```

Este comando lista todas as plataformas e dispositivos OpenCL disponíveis no sistema.

## Troubleshooting

### Erro: "OpenCL não está disponível"

1. Verifique se os drivers OpenCL estão instalados
2. Verifique se `node-opencl` foi instalado corretamente
3. Verifique os logs do console para mais detalhes

### Erro de compilação do node-opencl

1. Certifique-se de que Python 3.6+ está instalado
2. Certifique-se de que as ferramentas de build estão instaladas
3. Tente reinstalar: `npm rebuild node-opencl`

### Performance não melhorou

- OpenCL é mais eficiente com grandes volumes de dados
- Para pequenos datasets, o overhead pode ser maior que o benefício
- Verifique se o dispositivo CPU OpenCL está sendo usado (não GPU)

