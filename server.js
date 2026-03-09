import app from "./app.js"

const PORT = 7070

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})