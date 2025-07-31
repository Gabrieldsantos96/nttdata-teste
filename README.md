

# Developer Evaluation Project

## Instruções para Executar o Projeto

> **Observação**: Recomenda-se utilizar o Visual Studio Community para executar o projeto.

### 1. Configuração do Arquivo JSON
- Copie o arquivo JSON enviado pelo recrutador e cole-o em `Ambev.DeveloperEvaluation.Server/appsettings.Development.json`.
- Caso não tenha recebido o arquivo, solicite-o por e-mail para `gabrielk6.mobile@gmail.com` ou pelo WhatsApp: (35) 99196-9303.
- **Nota**: Este arquivo é essencial, pois o bucket de arquivos está hospedado na AWS.

### 2. Configuração do Projeto
- Defina o `docker-compose` como o projeto de inicialização (`Startup Item`) no Visual Studio.
- Ao executar o projeto, todas as dependências serão criadas automaticamente, incluindo:
  - Banco de dados SQL Server com migrations e seed aplicados.

### 3. Configuração do RavenDB
- Crie manualmente o banco de dados no RavenDB.
- O nome<ViewGroup> nome do banco deve ser `ravenDB`.
- Após executar o `docker-compose`, acesse a interface do RavenDB em: `localhost:8083`.

## Detalhes do Projeto

### Frontend
- **Framework e Bibliotecas**:
  - React com Vite
  - Zod para validação de formulários
  - React Query para gerenciamento de estado e requisições do lado do cliente
  - Shadcn como biblioteca de componentes

### Bancos de Dados
- SQL Server (relacional)
- RavenDB (NoSQL)

### Backend
- Padrão Mediator
- Fluent Validations para validação de dados
- Integração com S3 (AWS) para armazenamento de arquivos
- Entity Framework para acesso a dados
- Identity para autenticação e autorização

### DevOps
- Docker e Docker Compose para configurar e subir o ambiente automaticamente
- Proxy reverso no React Vite, com redirecionamento para o backend, garantindo que as requisições não sejam expostas diretamente ao cliente e sejam processadas pelo Node.js

