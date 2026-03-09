import dotenv from "dotenv"
import { DeleteMessageCommand, GetQueueAttributesCommand, ReceiveMessage$, ReceiveMessageCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
import mongoose from "mongoose";

dotenv.config()
const awsQueueUrl = process.env.AWS_QUEUE_URL

const sqs = new SQSClient(
    {
        region: "us-east-2",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    },
);

export async function adicionarCepFila(id) {
    try {
        const params = {
            QueueUrl: awsQueueUrl, MessageBody: JSON.stringify({ mongoId: id, action: 'created' })
        }
        await sqs.send(new SendMessageCommand(params))
        console.log(`Cep ${id} inserido na fila SQS com sucesso`)
    } catch (error) {
        console.log("Erro ao enviar cep para a fila SQS: ", error)
    }
}

async function checkQueue() {
    try {
        const params = {
            QueueUrl: awsQueueUrl,
            AttributeNames: ["ApproximateNumberOfMessages", "ApproximateNumberOfMessagesNotVisible"],
        }


        const data = await sqs.send(new GetQueueAttributesCommand(params))

        console.log("Mensagens Visíveis:", data.Attributes.ApproximateNumberOfMessages);
        console.log("Mensagens em Processamento:", data.Attributes.ApproximateNumberOfMessagesNotVisible);
    } catch (error) {
        console.log("Erro ao checar fila:", error)
    }
}

export async function receiveMessageFila() {

    checkQueue()

    try {
        const params = {
            QueueUrl: awsQueueUrl,
            WaitTimeSeconds: 15,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 30
        }

        const fila = await sqs.send(new ReceiveMessageCommand(params))

        // console.log("Conteúdo da fila:", fila)

        if(fila.Messages == undefined){
            console.log("Nenhuma mensagem encontrada na fila")
            return null
        }

        const { mongoId } = JSON.parse(fila.Messages[0].Body)
        const  handleFila  = fila.Messages[0].ReceiptHandle
        console.log("Handle fila:", handleFila)
        console.log("IDMongo obtida nas Mensagens:", mongoId)

        if(mongoose.isValidObjectId(mongoId)){
            const statusDelete = await tentativaDeleteMessageFila(handleFila)
            
            if(statusDelete) return mongoId
        }else{
            console.log("ID obtido na mensagem não é um id válido")
            return 
        }
        
    } catch (error) {
        console.log("Erro ao receber mensagens da fila:", error)
    }
}

export async function tentativaDeleteMessageFila(handle) {
    const params = {
        QueueUrl: awsQueueUrl,
        ReceiptHandle: handle
    }

    try {
        const returnDelete = await sqs.send(new DeleteMessageCommand(params))
        console.log("Mensagem deletada com sucesso")
        return true
    } catch (error) {
        console.error("Erro ao deletar a mensagem da fila: ", error)
        return false
    }

}

// receiveMessageFila()