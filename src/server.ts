import fastify from "fastify";

const app = fastify()

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

// Corpo da requisição (Request body)
// Parâmetros de busca (Search Params / Query Params) `http//localhost:3333/users?name=Raphael`
// Parâmetros de rota (route Params) -> Identificação de recursos 
// Cabeçalhos (Headers) -> Contexto

app.post('/events', () => {
    return 'Hello Raphael'
})


app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!")
})