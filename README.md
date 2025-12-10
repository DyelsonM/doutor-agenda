# 🏥 Doutor Agenda

Sistema completo de gestão de agendamentos para clínicas médicas, desenvolvido com Next.js 15, TypeScript, PostgreSQL e Drizzle ORM.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e cadastro de usuários
- Autenticação via email/senha e Google OAuth
- Proteção de rotas e sessões

### 🏢 Gestão de Clínica
- Cadastro e configuração de clínica
- Multi-tenancy (cada usuário gerencia sua própria clínica)

### 📊 Dashboard
- **Métricas em tempo real:**
  - Faturamento total
  - Total de agendamentos
  - Número de pacientes
  - Quantidade de médicos
- **Gráficos e relatórios:**
  - Gráfico de agendamentos diários
  - Top 10 médicos mais consultados
  - Top especialidades mais procuradas
  - Agendamentos do dia atual
- Filtro por período (data inicial e final)

### 👨‍⚕️ Gestão de Médicos
- Cadastro, edição e exclusão de médicos
- Configuração de disponibilidade:
  - Dias da semana de atendimento
  - Horário de início e fim
  - Especialidade médica
- Visualização em cards com informações completas

### 👤 Gestão de Pacientes
- Cadastro, edição e exclusão de pacientes
- Armazenamento de dados pessoais (nome, telefone, email, etc.)
- Visualização em tabela formatada

### 📅 Gestão de Agendamentos
- **Criação inteligente de agendamentos:**
  - Seleção de paciente e médico
  - Busca automática de horários disponíveis
  - Validação de conflitos de horário
  - Definição de valor da consulta
- Edição e exclusão de agendamentos
- Visualização em tabela com formatação de datas e valores
- Filtros e organização por data

### ⏰ Sistema de Disponibilidade
- **Validação automática de horários:**
  - Verifica dias da semana configurados para cada médico
  - Filtra horários dentro da janela de disponibilidade
  - Marca horários já agendados como indisponíveis
  - Gera slots de 30 em 30 minutos (05:00 às 23:30)
- Prevenção de agendamentos duplicados
- Validação em tempo real antes de confirmar

## 🛠️ Stack Tecnológica

- **Next.js 15** (App Router) - Framework React
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe
- **BetterAuth** - Autenticação (email/senha + Google OAuth)
- **React Hook Form + Zod** - Formulários e validação
- **TanStack Query** - Gerenciamento de estado
- **Recharts** - Gráficos e visualizações
- **shadcn/ui** - Componentes UI modernos
- **dayjs** - Manipulação de datas
- **next-safe-action** - Server Actions type-safe

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (.env)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Configurar banco de dados
npx drizzle-kit push

# 4. Executar aplicação
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
  app/
    (protected)/          # Rotas protegidas
      dashboard/          # Dashboard com métricas
      appointments/       # Gestão de agendamentos
      doctors/            # Gestão de médicos
      patients/           # Gestão de pacientes
      clinic-form/        # Formulário de clínica
    authentication/       # Login e cadastro
    api/                  # API REST
  actions/                # Server Actions
  components/ui/          # Componentes reutilizáveis
  db/                     # Schema e conexão do banco
  helpers/                # Funções utilitárias
```

## 🔑 Destaques Técnicos

- **Type-safety end-to-end** com TypeScript e Drizzle ORM
- **Server Actions** para operações no servidor
- **Validação inteligente** de disponibilidade de horários
- **Interface responsiva** e moderna
- **Multi-tenancy** com isolamento de dados por clínica
- **Cache e revalidação** otimizados com Next.js

---

**Sistema completo e profissional para gestão de agendamentos médicos.**
