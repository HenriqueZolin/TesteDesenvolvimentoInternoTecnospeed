import axios from "axios"
import { receiveMessageFila } from "../fila/sqsConfig.js"
import { connect, consultarCepPorId, casoStatusConcluido, casoStatusRejeitado} from "./../banco/MongoDB.js";

await connect()

async function consultaViaCep(cep) {
    const retornoConsulta = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
    )

    return retornoConsulta.data
}

async function workerRecebeMensagem() {
    try {
        while (true) {
            const idNota = await receiveMessageFila()

            if(idNota !== null){
                const conteudoNota = await consultarCepPorId(idNota)
    
                const { cep,status } = conteudoNota
    
                if(status === "PENDENTE") {
                    // console.log("CEP Enviado para o ViaCep:", cep)
                    const viacep = await consultaViaCep(cep)
                    console.log(viacep)
                    if(viacep.erro){
                        casoStatusRejeitado(idNota)
                    }else{
                        //fluxo para deixar o status como autorizada e adicionar os dados
                        casoStatusConcluido(idNota, viacep)
                    }
                }
            }else{
                continue
            }
        }
    } catch (error) {
        console.log("Erro ao processar mensagem no worker", error)
    }
}

workerRecebeMensagem()