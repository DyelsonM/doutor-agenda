# Instalação do OpenCL

Este projeto utiliza OpenCL para processamento paralelo em múltiplos núcleos da CPU. Siga os passos abaixo para configurar o ambiente.

## Passo 1: Instalar Drivers OpenCL

### Windows

1. **Intel CPUs**: Baixe e instale o [Intel OpenCL Runtime](https://www.intel.com/content/www/us/en/developer/articles/tool/opencl-drivers.html)
2. **AMD CPUs/GPUs**: Baixe e instale o [AMD OpenCL SDK](https://www.amd.com/en/support)
3. **NVIDIA GPUs**: Os drivers NVIDIA já incluem suporte OpenCL

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install opencl-headers ocl-icd-opencl-dev

# Fedora
sudo dnf install opencl-headers ocl-icd-devel
```

### macOS

OpenCL já vem pré-instalado no macOS. Nenhuma ação necessária.

## Passo 2: Instalar Ferramentas de Build

### Windows

Instale o [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) ou o Visual Studio completo com suporte a C++.

### Linux

```bash
sudo apt-get install build-essential
```

### macOS

```bash
xcode-select --install
```

## Passo 3: Instalar Python

O `node-opencl` requer Python 3.6+ para compilação.

### Windows

1. Baixe Python 3.11+ do [python.org](https://www.python.org/downloads/)
2. Durante a instalação, marque "Add Python to PATH"
3. Verifique a instalação:
   ```bash
   python --version
   ```

### Linux/macOS

Python geralmente já está instalado. Verifique:

```bash
python3 --version
```

## Passo 4: Instalar node-opencl

Após configurar os pré-requisitos, instale a biblioteca:

```bash
npm install node-opencl --legacy-peer-deps
```

### Se o Python não for encontrado (Windows)

Configure o caminho do Python:

```bash
npm config set python "C:\Python311\python.exe"
```

Ou defina a variável de ambiente:

```bash
set PYTHON=C:\Python311\python.exe
npm install node-opencl --legacy-peer-deps
```

## Passo 5: Verificar Instalação

### Verificar Drivers OpenCL

Instale o `clinfo` para verificar se o OpenCL está funcionando:

**Windows**: Baixe de [GitHub](https://github.com/Oblomov/clinfo/releases)

**Linux**:
```bash
sudo apt-get install clinfo
clinfo
```

**macOS**:
```bash
brew install clinfo
clinfo
```

O comando `clinfo` deve listar as plataformas e dispositivos OpenCL disponíveis.

### Verificar no Projeto

O sistema automaticamente detecta se o OpenCL está disponível. Se não estiver, usará processamento sequencial como fallback.

## Troubleshooting

### Erro: "Python is not set"

1. Verifique se Python está instalado: `python --version`
2. Configure o caminho: `npm config set python "C:\Path\To\python.exe"`
3. Ou defina a variável de ambiente `PYTHON`

### Erro: "node-gyp rebuild failed"

1. Certifique-se de que as ferramentas de build estão instaladas
2. No Windows, execute: `npm install --global windows-build-tools`
3. Tente: `npm rebuild node-opencl`

### Erro: "No OpenCL platforms found"

1. Verifique se os drivers OpenCL estão instalados
2. Execute `clinfo` para verificar dispositivos disponíveis
3. Reinicie o computador após instalar os drivers

### Performance não melhorou

- OpenCL é mais eficiente com grandes volumes de dados
- Para pequenos datasets, o overhead pode ser maior que o benefício
- Verifique se está usando o dispositivo CPU (não GPU) para processamento paralelo de CPU

## Notas Importantes

- O sistema funciona mesmo sem OpenCL instalado (usa fallback sequencial)
- OpenCL é opcional, mas recomendado para melhor performance
- A primeira execução pode ser mais lenta devido à compilação dos kernels

