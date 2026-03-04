import dotenv from "dotenv"
import { connect, consultarCepBanco } from "./../banco/MongoDB.js";
import { adicionarCepFila } from "../fila/sqsConfig.js";
import express from "express"
import mongoose from "mongoose";

await connect()

const app = express()
dotenv.config()
app.use(express.json());
const PORT = 7070

async function insertCep(cep) {

    // console.log(cepBody)
    // const cep = cepBody.cep

    const insert = await mongoose.connection
        .useDb("consultaCepNode")
        .collection("cep")
        .insertOne(
            {
                "cep": cep,
                "status": "PENDENTE"
            }
        )


    if (insert.acknowledged === true) {
        console.log(`Cep ${cep} inserido no banco com sucesso com id ${insert.insertedId}`)
        adicionarCepFila(insert.insertedId)
        return true
    } else {
        console.log("Erro ao inserir registro no banco.")
        return false
    }

}

// ROTAS

app.post("/cep", async (req, res) => {

    try {
        const cepEnvio = req.body.cep
        const inserirCep = await insertCep(cepEnvio)

        if (inserirCep === true) {

            const retorno = await consultarCepBanco(cepEnvio)

            res.status(200).json({
                cep: retorno.cep,
                status: retorno.status
            })
        }
    } catch (error) {
        console.log("Erro ao insetir CEP: ", error)
    }
})

app.get("/cep", async (req, res) => {
    try {
        const cepEnvio = req.body.cep
        const consulta = await consultarCepBanco(cepEnvio)

        res.status(200).json(
            consulta
        )
    } catch (error) {
        console.error("Erro ao dar GET no CEP: ", error)
    }
})

app.listen(PORT, () => {
    console.log(`UI disponível em http://localhost:${PORT}`);
});
// insertCep({cep:"111",status:"teste"})

