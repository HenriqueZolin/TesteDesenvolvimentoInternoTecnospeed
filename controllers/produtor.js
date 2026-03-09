import express from "express"
import { enviarCep, consultaCep } from "../services/produtorService.js";
const app = express()
app.use(express.json());

// ROTAS

export async function postCep(req, res) {
    const cepEnvio = req.body.cep
    const retornoEnvioCep = await enviarCep(cepEnvio)
    
     res.status(200).json(retornoEnvioCep)
}

export async function getCep(req, res) {
    const cepEnvio = req.params.cep
    const consulta = await consultaCep(cepEnvio)

    res.status(200).json(consulta)
}
