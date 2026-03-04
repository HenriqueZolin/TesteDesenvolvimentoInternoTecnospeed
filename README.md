Demo de projeto teste desenvolvimento da TecnoSpeed.

Projeot se baseia em uma rota assincrona de cadastro/consulta de CEP onde ao cadastrar criamos uma mensagem em uma fila SQS e um registro no banco enquanto um Worker consulta essa fila e atualiza o banco para  arota de consulta trazer as informações atualizadas

Ferramentas utilizadas:
- Node com mongoose, aws-sdk/client-sqs axios para consulta da API "viacep" e express para criação de rota

Para rodar o sistema: 
- git clone
- cd consultacepnode
- npm i
- node consumidor/consumidor.js
- node produtor/produtor.js

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