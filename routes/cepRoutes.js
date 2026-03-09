import express from "express"
import { postCep, getCep } from "../controllers/produtor.js"

const rotas = express.Router()

rotas.post("/", postCep)
rotas.get("/:cep", getCep)

export default rotas