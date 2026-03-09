Demo de projeto teste desenvolvimento da TecnoSpeed.

Projeot se baseia em uma rota assincrona de cadastro/consulta de CEP onde ao cadastrar criamos uma mensagem em uma fila SQS e um registro no banco enquanto um Worker consulta essa fila e atualiza o banco para  arota de consulta trazer as informações atualizadas

Ferramentas utilizadas:
- Node com mongoose, aws-sdk/client-sqs axios para consulta da API "viacep" e express para criação de rota

Para rodar o sistema: 
- git clone
- cd consultacepnode
- npm i
- node workers/consumidor.js
- node server.js

Versões:

v1 - 04/03/2026 (MVP com todas as demandas mas ainda não muito otimizado)

Rotas: 

http://localhost:7070/cep (post)
Body:
{
    "cep":"87020025"
}

http://localhost:7070/cep (get)
Body:
{
    "cep":"87020025"
}


v2 - 09/03/2026 
Alterações na estrutura do projeto, refatorei o código inserindo uma arquitetura MVC, dessa forma dividi ainda mais o produtor e consumidor
Produtor agora está integrado corretamente em controller/service e roda através de um server.js
Enquanto o consumidor agora está isonaldo em um Worker

Fiz também uma validação a mais no CNPJ enviando para que este contenha apenas os números

Códigos no geral mais compactados e modulares

http://localhost:7070/cep (post)
Body:
{
    "cep":"87020025"
}

http://localhost:7070/cep/87020025 (get) <------------- alteracao para retirar o cep do body e colocar como parâmetro
