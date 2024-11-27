import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

// Corpo da requisição (Request body)
// Parâmetros de busca (Search Params / Query Params) `http//localhost:3333/users?name=Raphael`
// Parâmetros de rota (route Params) -> Identificação de recursos 
// Cabeçalhos (Headers) -> Contexto

app.post('/events', async (resquest, reply) => {
    
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
    })

    const data = createEventSchema.parse(resquest.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString(),
        }
    })


    return reply.status(201).send({ eventId: event.id})
})


app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!")
})