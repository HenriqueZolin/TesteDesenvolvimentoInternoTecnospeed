import axios from "axios"
import { consultarCepPorId, casoStatusConcluido, casoStatusRejeitado} from "./../model/MongoDB.js";

export async function consultaViaCepService(cep) {
    const retornoConsulta = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
    )
    return retornoConsulta.data
}

export async function processarMensagem(idNota) {
    try {
        // const idNota = await receiveMessageFila()
        console.log("idnota  obtido:", idNota)
        if (idNota !== null) {
            const conteudoNota = await consultarCepPorId(idNota)

            const { cep, status } = conteudoNota

            if (status === "PENDENTE") {
                // console.log("CEP Enviado para o ViaCep:", cep)
                const viacep = await consultaViaCepService(cep)
                // console.log(viacep)
                if (viacep.erro) {
                    casoStatusRejeitado(idNota)
                } else {
                    //fluxo para deixar o status como autorizada e adicionar os dados
                    casoStatusConcluido(idNota, viacep)
                }
            }
        } else {
            return
        }
    } catch (error) {
        console.log("Erro ao processar mensagem no worker", error)
    }
}