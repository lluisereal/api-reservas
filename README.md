# API de Reservas de Espaços

API REST para reserva de espaços da faculdade (laboratórios, salas de estudo e auditório), desenvolvida com Node.js e Express.

Projeto da disciplina **API e Web Services** (Sistemas para Internet, UNIMAM), II Bimestre 2026.2.

**Autor:** _(Hanna Luíse Real e Gustavo Capinam)_

## Tecnologias

- Node.js e Express
- SQLite com Sequelize (persistência)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas
- `dotenv` para variáveis de ambiente
- `nodemon` (desenvolvimento)

## Entidades e relacionamentos

| Entidade | Atributos |
|---|---|
| Usuario | id, nome, email (único), senha (hash), perfil (`ADMIN` ou `USER`) |
| Sala | id, nome (único), capacidade, descricao |
| Reserva | id, data, horaInicio, horaFim, usuarioId, salaId |

- Um usuário tem várias reservas (1:N).
- Uma sala tem várias reservas (1:N).
- Integridade referencial: não é possível excluir usuário ou sala que possuam reservas (`onDelete: RESTRICT`).

```
Usuario (1) ────< Reserva >──── (1) Sala
```

## Arquitetura em camadas

```
src/
├── config/          conexão com o banco
├── controllers/     recebem a requisição e devolvem a resposta HTTP
├── middlewares/     autenticação (JWT), autorização (perfil) e tratamento de erros
├── models/          entidades e relacionamentos
├── repositories/    acesso ao banco de dados
├── routes/          definição dos endpoints
├── services/        regras de negócio e validações
├── utils/           classe AppError
├── app.js           configuração do Express
├── seed.js          criação do primeiro administrador
└── server.js        inicialização do servidor
```

Caminho de uma requisição: **Route → Middleware → Controller → Service → Repository → Model → Banco**, e a resposta volta pelo mesmo caminho.

## Como executar

**Pré-requisito:** Node.js (versão LTS).

1. Clone o repositório e entre na pasta:

```bash
git clone <URL-DO-SEU-REPOSITORIO>
cd api-reservas
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto (veja `.env.example`):

```
PORT=3000
JWT_SECRET=troque_por_uma_frase_longa_e_secreta
ADMIN_EMAIL=admin@unimam.com
ADMIN_SENHA=admin123
```

4. Inicie o servidor (cria o banco e as tabelas automaticamente):

```bash
npm run dev
```

5. Em outro terminal, crie o primeiro administrador:

```bash
npm run seed
```

O servidor fica disponível em `http://localhost:3000`.

## Autenticação e autorização

- O cadastro (`POST /auth/register`) sempre cria usuários com perfil `USER`. O perfil `ADMIN` não pode ser atribuído pelo cadastro público.
- O primeiro `ADMIN` é criado pelo script `npm run seed`, com credenciais lidas do `.env`.
- O login (`POST /auth/login`) devolve um token JWT válido por 1 hora.
- Nas rotas protegidas, envie o cabeçalho: `Authorization: Bearer <token>`.
- Senhas são armazenadas com hash (bcrypt).

## Endpoints

### Autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Público | Cadastra usuário (perfil USER) |
| POST | `/auth/login` | Público | Autentica e devolve o token |

### Salas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/salas` | Autenticado | Lista as salas |
| GET | `/salas/:id` | Autenticado | Busca uma sala |
| GET | `/salas/:id/reservas` | Autenticado | Lista as reservas de uma sala |
| POST | `/salas` | ADMIN | Cria uma sala |
| PUT | `/salas/:id` | ADMIN | Atualiza uma sala |
| DELETE | `/salas/:id` | ADMIN | Exclui uma sala |

### Reservas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/reservas` | Autenticado | Cria uma reserva para o usuário logado |
| GET | `/reservas/minhas` | Autenticado | Lista apenas as reservas do usuário logado |
| GET | `/reservas` | ADMIN | Lista todas as reservas (com sala e usuário) |
| GET | `/reservas/:id` | Dono ou ADMIN | Busca uma reserva |
| PUT | `/reservas/:id` | Dono ou ADMIN | Atualiza uma reserva |
| DELETE | `/reservas/:id` | Dono ou ADMIN | Cancela uma reserva |

### Exemplos de corpo (JSON)

Cadastro:

```json
{ "nome": "Ana Souza", "email": "ana@email.com", "senha": "123456" }
```

Sala:

```json
{ "nome": "Laboratório 1", "capacidade": 30, "descricao": "Computadores com Linux" }
```

Reserva (`data` no formato `AAAA-MM-DD` e horas no formato `HH:MM`):

```json
{ "salaId": 1, "data": "2026-11-20", "horaInicio": "19:00", "horaFim": "21:00" }
```

## Regras de negócio

Implementadas na camada de Services:

1. **Horário ocupado:** não é possível reservar uma sala em um horário que se sobreponha a outra reserva da mesma sala e data (409). Reservas consecutivas (uma termina quando a outra começa) são permitidas.
2. **Horário válido:** a hora de término deve ser maior que a hora de início (400).
3. **Integridade:** não é possível excluir uma sala que possua reservas (409).

Regras adicionais: um usuário comum só acessa as próprias reservas (403 nas de outros), o email e o nome da sala são únicos (409) e a reserva exige uma sala existente (404).

## Códigos HTTP utilizados

| Código | Significado |
|---|---|
| 200 | Operação realizada |
| 201 | Recurso criado |
| 204 | Exclusão realizada |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso proibido |
| 404 | Recurso não encontrado |
| 409 | Conflito de dados |
| 500 | Erro interno |

## Persistência

Os dados são gravados em um arquivo SQLite (`database.sqlite`, criado na raiz do projeto) e permanecem disponíveis após reiniciar o servidor. O arquivo não é versionado (está no `.gitignore`).
