import { receiveMessageFila } from "../public/sqsQueue.js"
import {  processarMensagem } from "../services/consumidorService.js";

async function workerRecebeMensagem() {
    while (true) {
        const idNota = await receiveMessageFila()
        await processarMensagem(idNota)
    }
}

workerRecebeMensagem()