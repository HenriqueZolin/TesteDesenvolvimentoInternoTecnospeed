import mongoose from "mongoose"

export async function connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    await mongoose.connect('mongodb://localhost:27017/'); // coloque a URL em env var
    console.log("Database rodando!!");

    return mongoose.connection;
}

export async function consultarCepBanco(cep) {

    // const cep = cepConsultar.cep
    // console.log("cep consulta banco:", cep)
    const search = await mongoose.connection
        .useDb("consultaCepNode")
        .collection("cep")
        .findOne(
            { cep: cep },
            { projection: { _id: 0 } }
        )

    return search
}

export async function consultarCepPorId(id) {

    if (!mongoose.isValidObjectId(id)) {
        console.log("Erro ao ler id, id não é do tipo ObjectiveId")
        return
    }
    const search = await mongoose.connection
        .useDb("consultaCepNode")
        .collection("cep")
        .findOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { projection: { _id: 0 } }
        )

    return search
}

export async function casoStatusRejeitado(id) {
    try {
        const update = await mongoose.connection
            .useDb("consultaCepNode")
            .collection("cep")
            .updateOne(
                { _id: new mongoose.Types.ObjectId(id) },
                {
                    $set: {
                        status: "REJEITADO"
                    }
                }

            )

        console.log("CEP Atualizado no banco para REJEITADO")
        return true
    } catch (error) {
        console.log("Erro ao atualizar documento no banco para REJEITADO:", error)
    }
}

export async function casoStatusConcluido(id, cepObject) {
    try {
        const update = await mongoose.connection
            .useDb("consultaCepNode")
            .collection("cep")
            .updateOne(
                { _id: new mongoose.Types.ObjectId(id) },
                {
                    $set: {
                        status: "CONCLUIDO",
                        data: cepObject
                    }
                }
            )

        console.log("CEP Atualizado no banco para CONCLUIDO")
        return true
    } catch (error) {
        console.log("Erro ao atualizar documento no banco para CONCLUIDO:", error)
    }
}

// connect()
// console.log(await consultarCepPorId("69a4aa7b6301234bc0bc1666"))