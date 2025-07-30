# Developer Evaluation Project

## Instruções para executar o projeto.

OBS: Recomendo executar no visual studio community

- Cole o json enviado em particular pra recruiter dentro de Ambev.DeveloperEvalution.Server/appsettings.Development.json

- Caso não tenha recebido solicite por e-mail gabrielk6.mobile@gmail.com ou se preferir whatsapp (35) 99196-9303 - Ele é necessário para o funcionamento pois o bucket de arquivos está hospedado na AWS

- Selecionar como projeto de inicialização o docker-compose `Startup Item` o projeto `docker-compose`

  Ao executar o projeto todas as dependencias vão ser criadas automaticamente assim como o: Banco SQL juntos com as migrations e tambem o seed.

- Será necessário criar manualmente o banco do RavenDB

    O nome do banco deve ser `ravenDB` e para acessar a interface depois de rodar o docker-compose do banco basta acessar: `localhost:8083`
