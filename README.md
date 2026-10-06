# Find a Friend API

API para gestão de ONGs e adoção de pets. O projeto permite cadastrar organizações, autenticar organizações, registrar pets disponíveis para adoção e consultar pets por cidade e filtros de características.

## 1. Tecnologias utilizadas

- TypeScript
- Node.js
- Fastify
- Prisma ORM
- PostgreSQL
- Docker e Docker Compose
- Vitest
- Supertest
- Zod
- bcryptjs
- tsx, tsup

## 2. Requisitos para rodar

- Git
- Docker e Docker Compose
- npm
- Node.js 20.19+, 22.12+ ou 24+ (recomendado: 24 LTS)

## 3. Passo a passo para rodar localmente

### 3.1. Clonar o repositório

```bash
git clone https://github.com/Lucas-Kunzler/find-a-friend-api.git
cd find-a-friend-api
```

### 3.2. Instalar dependências

```bash
npm install
```

### 3.3. Criar o arquivo .env a partir do .env.example

O projeto inclui o arquivo [.env.example](.env.example) com as variáveis base para execução local.

```bash
cp .env.example .env
```

Variáveis presentes no arquivo:

| Variável     | Descrição                                         | Valor no exemplo                                                            |
| ------------ | ------------------------------------------------- | --------------------------------------------------------------------------- |
| DATABASE_URL | String de conexão do PostgreSQL usada pelo Prisma | `postgresql://postgres:postgres@localhost:5432/find_a_friend?schema=public` |
| NODE_ENV     | Ambiente da aplicação                             | `dev`                                                                       |
| PORT         | Porta HTTP da API                                 | `3333`                                                                      |
| JWT_SECRET   | Chave usada para assinar tokens JWT               | `findafriend`                                                               |

Observações:

- O Docker Compose cria um banco PostgreSQL na porta 5432 com usuário `postgres`, senha `postgres` e banco `find_a_friend`.
- A variável `DATABASE_URL` deve refletir esse mesmo endereço e banco para que o Prisma e a aplicação consigam se conectar corretamente.

### 3.4. Subir o banco com Docker

```bash
docker compose up -d
```

O arquivo [docker-compose.yml](docker-compose.yml) define um serviço `postgres` com:

- imagem: `postgres:16`
- porta: `5432:5432`
- usuário: `postgres`
- senha: `postgres`
- banco: `find_a_friend`

### 3.5. Gerar o client do Prisma e rodar as migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### 3.6. Iniciar o servidor

Modo de desenvolvimento:

```bash
npm run start:dev
```

A aplicação usa Fastify e escuta em `PORT` (padrão 3333).

## 4. Como rodar os testes

### Testes unitários

```bash
npm test
```

Ou em modo watch:

```bash
npm run test:watch
```

### Testes e2e

```bash
npm run test:e2e
```

Modo watch:

```bash
npm run test:e2e:watch
```

### Cobertura de testes

```bash
npm run test:coverage
```

## 5. Regras de negócio e requisitos funcionais

A aplicação possui os seguintes requisitos funcionais e regras de negócio observados no código e nos casos de uso:

- Cadastro de organização (`ORG`) com nome, e-mail, CEP, endereço, cidade, estado, WhatsApp e senha.
- E-mail da organização deve ser único.
- Senha da organização é armazenada com hash usando `bcryptjs`.
- Login de organização com e-mail e senha, gerando JWT.
- Atualização de dados da própria organização autenticada.
- Listagem de organizações com paginação (`page`).
- Consulta de organização por ID.
- Cadastro de pets vinculados a uma organização.
- Cada pet deve estar associado a uma organização (`orgId`).
- Um pet contém dados como nome, descrição, tipo, idade, energia, porte, independência e ambiente.
- Listagem de pets por cidade, sendo a cidade obrigatória.
- Filtros opcionais de pet: estado, tipo, idade, porte, energia, independência e ambiente.
- Autenticação obrigatória para registrar um pet.
- O upload de imagens do pet usa multipart e aceita apenas JPEG, PNG e WEBP.
- Máximo de 10 imagens por pet.
- Tamanho máximo por imagem: 5 MB.
- O contato com o interessado em adoção é feito com a organização por WhatsApp.

## 6. Rotas da API

| Método | Caminho          | Descrição                                               | Requer autenticação                     |
| ------ | ---------------- | ------------------------------------------------------- | --------------------------------------- |
| POST   | `/orgs`          | Cadastro de uma organização                             | Não                                     |
| GET    | `/orgs`          | Listagem de organizações com paginação                  | Não                                     |
| GET    | `/orgs/:orgId`   | Busca uma organização por ID                            | Não                                     |
| PATCH  | `/orgs`          | Atualiza dados da organização autenticada               | Sim                                     |
| POST   | `/sessions`      | Autenticação da organização e retorno de token          | Não                                     |
| PATCH  | `/token/refresh` | Gera novo token usando o cookie de refresh              | Sim (via Authorization: Bearer <token>) |
| POST   | `/pets`          | Cadastro de um pet (multipart/form-data com imagens)    | Sim                                     |
| GET    | `/pets`          | Lista pets com filtros por cidade e outras propriedades | Não                                     |
| GET    | `/pets/:id`      | Busca um pet por ID                                     | Não                                     |

Detalhes importantes:

- A autenticação usa JWT via `@fastify/jwt`.
- A rota de cadastro de pets usa upload multipart e chama o middleware de verificação antes do parsing do formulário.
- A página de listagem de orgs usa query `?page=1`.

## 7. Decisões de arquitetura

- **Casos de uso:** cada regra de negócio fica isolada em uma classe própria (`RegisterOrgUseCase`, `ListPetsUseCase`...), sem dependência de HTTP ou de banco.
- **Padrão Repository:** os casos de uso dependem de interfaces (`OrgsRepository`, `PetsRepository`), com implementações em Prisma (produção) e em memória (testes unitários).
- **Factories:** a montagem das dependências fica em `use-cases/factories`, deixando os controllers enxutos.
- **Storage abstrato:** o upload de imagens passa por uma interface (`storage.ts`), o que permite trocar a implementação (ex: local, S3) sem mexer nos casos de uso.
- **Tratamento de erros centralizado:** erros de negócio e de validação (Zod) são convertidos em respostas HTTP em um único `setErrorHandler`.
- **Testes:** unitários com repositórios in-memory e E2E com Supertest em banco isolado via ambiente customizado do Vitest.
