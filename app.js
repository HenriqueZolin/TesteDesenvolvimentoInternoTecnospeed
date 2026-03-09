import express from "express"
import cepRoutes from "./routes/cepRoutes.js"

const app = express()
app.use(express.json())

// todas as rotas do CEP ficam em /cep
app.use("/cep", cepRoutes)

export default app