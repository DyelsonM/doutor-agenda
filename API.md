# API Documentation - Doutor Agenda

API REST para gerenciamento de clínicas médicas, médicos, pacientes e agendamentos.

## Base URL

```
http://localhost:3000/api/v1
```

## Autenticação

A API utiliza autenticação via **Bearer Token**. Após o login, você receberá um token que deve ser enviado no header `Authorization` de todas as requisições protegidas.

```
Authorization: Bearer {seu_token}
```

---

## Endpoints

### 🔐 Autenticação

#### Login

Realiza login e retorna um token de autenticação.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "email": "usuario@exemplo.com",
      "clinic": {
        "id": "clinic-uuid",
        "name": "Clínica Exemplo"
      }
    }
  }
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "code": "UNAUTHORIZED"
  }
}
```

---

### 👨‍⚕️ Médicos

#### Listar Médicos

Lista todos os médicos da clínica do usuário autenticado.

**Endpoint:** `GET http://localhost:3000/api/v1/doctors`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "doctor-uuid",
      "clinicId": "clinic-uuid",
      "name": "Dr. João Silva",
      "avatarImageUrl": "https://exemplo.com/avatar.jpg",
      "specialty": "Cardiologia",
      "appointmentPriceInCents": 15000,
      "availableFromWeekDay": 1,
      "availableToWeekDay": 5,
      "availableFromTime": "08:00",
      "availableToTime": "18:00",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Detalhes do Médico

Retorna os detalhes de um médico específico.

**Endpoint:** `GET /doctors/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "doctor-uuid",
    "clinicId": "clinic-uuid",
    "name": "Dr. João Silva",
    "avatarImageUrl": "https://exemplo.com/avatar.jpg",
    "specialty": "Cardiologia",
    "appointmentPriceInCents": 15000,
    "availableFromWeekDay": 1,
    "availableToWeekDay": 5,
    "availableFromTime": "08:00",
    "availableToTime": "18:00",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": {
    "message": "Doctor not found",
    "code": "NOT_FOUND"
  }
}
```

---

#### Criar Médico

Cria um novo médico na clínica.

**Endpoint:** `POST /doctors`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Dr. João Silva",
  "avatarImageUrl": "https://exemplo.com/avatar.jpg",
  "specialty": "Cardiologia",
  "appointmentPriceInCents": 15000,
  "availableFromWeekDay": 1,
  "availableToWeekDay": 5,
  "availableFromTime": "08:00",
  "availableToTime": "18:00"
}
```

**Campos:**
- `name` (string, obrigatório): Nome do médico
- `avatarImageUrl` (string, opcional): URL da foto do médico
- `specialty` (string, obrigatório): Especialidade médica
- `appointmentPriceInCents` (number, obrigatório): Preço da consulta em centavos
- `availableFromWeekDay` (number, obrigatório): Dia da semana inicial (0=Domingo, 1=Segunda, ..., 6=Sábado)
- `availableToWeekDay` (number, obrigatório): Dia da semana final
- `availableFromTime` (string, obrigatório): Horário inicial (formato: "HH:MM")
- `availableToTime` (string, obrigatório): Horário final (formato: "HH:MM")

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": "doctor-uuid",
    "clinicId": "clinic-uuid",
    "name": "Dr. João Silva",
    "avatarImageUrl": "https://exemplo.com/avatar.jpg",
    "specialty": "Cardiologia",
    "appointmentPriceInCents": 15000,
    "availableFromWeekDay": 1,
    "availableToWeekDay": 5,
    "availableFromTime": "08:00",
    "availableToTime": "18:00",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Atualizar Médico

Atualiza os dados de um médico.

**Endpoint:** `PUT /doctors/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Dr. João Silva",
  "specialty": "Cardiologia",
  "appointmentPriceInCents": 15000
}
```

**Nota:** Todos os campos são opcionais. Envie apenas os campos que deseja atualizar.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "doctor-uuid",
    "clinicId": "clinic-uuid",
    "name": "Dr. João Silva",
    "avatarImageUrl": "https://exemplo.com/avatar.jpg",
    "specialty": "Cardiologia",
    "appointmentPriceInCents": 15000,
    "availableFromWeekDay": 1,
    "availableToWeekDay": 5,
    "availableFromTime": "08:00",
    "availableToTime": "18:00",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Deletar Médico

Deleta um médico da clínica.

**Endpoint:** `DELETE /doctors/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Doctor deleted successfully"
  }
}
```

---

### 👤 Pacientes

#### Listar Pacientes

Lista todos os pacientes da clínica do usuário autenticado.

**Endpoint:** `GET /patients`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "patient-uuid",
      "clinicId": "clinic-uuid",
      "name": "Maria Santos",
      "email": "maria@exemplo.com",
      "phoneNumber": "(11) 98765-4321",
      "sex": "female",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Detalhes do Paciente

Retorna os detalhes de um paciente específico.

**Endpoint:** `GET /patients/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "patient-uuid",
    "clinicId": "clinic-uuid",
    "name": "Maria Santos",
    "email": "maria@exemplo.com",
    "phoneNumber": "(11) 98765-4321",
    "sex": "female",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Criar Paciente

Cria um novo paciente na clínica.

**Endpoint:** `POST /patients`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@exemplo.com",
  "phoneNumber": "(11) 98765-4321",
  "sex": "female"
}
```

**Campos:**
- `name` (string, obrigatório): Nome do paciente
- `email` (string, obrigatório): Email do paciente
- `phoneNumber` (string, obrigatório): Telefone do paciente
- `sex` (string, obrigatório): Sexo do paciente ("male" ou "female")

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": "patient-uuid",
    "clinicId": "clinic-uuid",
    "name": "Maria Santos",
    "email": "maria@exemplo.com",
    "phoneNumber": "(11) 98765-4321",
    "sex": "female",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Atualizar Paciente

Atualiza os dados de um paciente.

**Endpoint:** `PUT /patients/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Maria Santos Silva",
  "phoneNumber": "(11) 99999-9999"
}
```

**Nota:** Todos os campos são opcionais. Envie apenas os campos que deseja atualizar.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "patient-uuid",
    "clinicId": "clinic-uuid",
    "name": "Maria Santos Silva",
    "email": "maria@exemplo.com",
    "phoneNumber": "(11) 99999-9999",
    "sex": "female",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Deletar Paciente

Deleta um paciente da clínica.

**Endpoint:** `DELETE /patients/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Patient deleted successfully"
  }
}
```

---

### 📅 Agendamentos

#### Listar Agendamentos

Lista todos os agendamentos da clínica do usuário autenticado.

**Endpoint:** `GET /appointments`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "appointment-uuid",
      "clinicId": "clinic-uuid",
      "doctorId": "doctor-uuid",
      "patientId": "patient-uuid",
      "date": "2024-01-15T14:00:00.000Z",
      "appointmentPriceInCents": 15000,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "doctor": {
        "id": "doctor-uuid",
        "name": "Dr. João Silva",
        "specialty": "Cardiologia"
      },
      "patient": {
        "id": "patient-uuid",
        "name": "Maria Santos",
        "email": "maria@exemplo.com",
        "phoneNumber": "(11) 98765-4321"
      }
    }
  ]
}
```

---

#### Detalhes do Agendamento

Retorna os detalhes de um agendamento específico.

**Endpoint:** `GET /appointments/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "appointment-uuid",
    "clinicId": "clinic-uuid",
    "doctorId": "doctor-uuid",
    "patientId": "patient-uuid",
    "date": "2024-01-15T14:00:00.000Z",
    "appointmentPriceInCents": 15000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "doctor": {
      "id": "doctor-uuid",
      "name": "Dr. João Silva",
      "specialty": "Cardiologia"
    },
    "patient": {
      "id": "patient-uuid",
      "name": "Maria Santos",
      "email": "maria@exemplo.com",
      "phoneNumber": "(11) 98765-4321"
    }
  }
}
```

---

#### Criar Agendamento

Cria um novo agendamento na clínica.

**Endpoint:** `POST /appointments`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "doctorId": "doctor-uuid",
  "patientId": "patient-uuid",
  "date": "2024-01-15",
  "time": "14:00",
  "appointmentPriceInCents": 15000
}
```

**Campos:**
- `doctorId` (string, obrigatório): UUID do médico
- `patientId` (string, obrigatório): UUID do paciente
- `date` (string, obrigatório): Data do agendamento (formato: "YYYY-MM-DD")
- `time` (string, obrigatório): Horário do agendamento (formato: "HH:MM")
- `appointmentPriceInCents` (number, obrigatório): Preço da consulta em centavos

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": "appointment-uuid",
    "clinicId": "clinic-uuid",
    "doctorId": "doctor-uuid",
    "patientId": "patient-uuid",
    "date": "2024-01-15T14:00:00.000Z",
    "appointmentPriceInCents": 15000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": {
    "message": "Time not available"
  }
}
```

---

#### Cancelar Agendamento

Cancela (deleta) um agendamento.

**Endpoint:** `DELETE /appointments/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Appointment deleted successfully"
  }
}
```

---

#### Horários Disponíveis

Retorna os horários disponíveis de um médico em uma data específica.

**Endpoint:** `GET /appointments/available-times?doctorId={uuid}&date={YYYY-MM-DD}`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `doctorId` (string, obrigatório): UUID do médico
- `date` (string, obrigatório): Data para consultar disponibilidade (formato: "YYYY-MM-DD")

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "value": "08:00",
      "label": "08:00",
      "available": true
    },
    {
      "value": "09:00",
      "label": "09:00",
      "available": false
    },
    {
      "value": "10:00",
      "label": "10:00",
      "available": true
    }
  ]
}
```

---

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Erro na requisição (dados inválidos)
- `401 Unauthorized`: Não autenticado ou token inválido
- `404 Not Found`: Recurso não encontrado
- `422 Unprocessable Entity`: Erro de validação
- `500 Internal Server Error`: Erro interno do servidor

## Formato de Resposta

Todas as respostas da API seguem o mesmo formato:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro",
    "code": "CODIGO_ERRO"
  }
}
```

## Exemplos de Uso

### Exemplo com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'

# Listar médicos
curl -X GET http://localhost:3000/api/v1/doctors \
  -H "Authorization: Bearer seu_token_aqui"

# Criar paciente
curl -X POST http://localhost:3000/api/v1/patients \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@exemplo.com",
    "phoneNumber": "(11) 98765-4321",
    "sex": "female"
  }'
```

### Exemplo com JavaScript (fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'usuario@exemplo.com',
      password: 'senha123',
    }),
  });
  
  const data = await response.json();
  return data.data.token;
};

// Listar médicos
const getDoctors = async (token) => {
  const response = await fetch('http://localhost:3000/api/v1/doctors', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  return data.data;
};
```

---

## Notas Importantes

1. **Autenticação**: Todas as rotas, exceto `/auth/login`, requerem autenticação via Bearer Token.
2. **Clínica**: O usuário autenticado deve estar vinculado a uma clínica. Todas as operações são realizadas no contexto da clínica do usuário.
3. **Validação**: Todos os dados são validados usando Zod. Mensagens de erro detalhadas são retornadas em caso de validação falhar.
4. **Segurança**: Os usuários só podem acessar recursos (médicos, pacientes, agendamentos) pertencentes à sua clínica.
5. **Horários**: 
   - Dias da semana: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
   - Formato de hora: "HH:MM" (ex: "08:00", "14:30")
6. **Valores monetários**: Todos os valores são armazenados em centavos (ex: R$ 150,00 = 15000 centavos).

