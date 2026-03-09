import dotenv from "dotenv"
import { connect, consultarCepBanco, insertCep } from "./../model/MongoDB.js";
import { adicionarCepFila } from "../public/sqsQueue.js";
import mongoose from "mongoose";

dotenv.config()
await connect()

export async function enviarCep(cepEnvio) {
    try {
        //retira todos os caracteres que não forem números
        const cep = cepEnvio.toString().replace(/\D/g, '')
         //da um insert na nota no banco e retora True ou False
        const inserirCep = await insertCep(cep)

        if (mongoose.isValidObjectId(inserirCep)) {
            adicionarCepFila(inserirCep)
            //consulta a nota no banco para retornar ao usuario
            const consultaCepBanco = await consultarCepBanco(cepEnvio)
            return consultaCepBanco
        } else {
            return {}
        }
    } catch (error) {
        console.log("Erro ao insetir CEP: ", error)
    }
}

export async function consultaCep(cep) {
    try {
        const consulta = await consultarCepBanco(cep)

        return consulta
    } catch (error) {
        console.error("Erro ao dar GET no CEP: ", error)
    }
}