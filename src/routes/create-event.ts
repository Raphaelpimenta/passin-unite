import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance) {

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid(),
                    })
                }
            }
        }, async (resquest, reply) => {

            // const createEventSchema = 

            const { title, details, maximumAttendees } = resquest.body

            const slug = generateSlug(title)

            const evenWithSameSlug = await prisma.event.findUnique({
                where: {
                    slug,
                }
            })

            if (evenWithSameSlug !== null) {
                throw new Error('Another event with same title already exists.')
            }

            const event = await prisma.event.create({
                data: {
                    title,
                    details,
                    maximumAttendees,
                    slug,
                }
            })


            return reply.status(201).send({ eventId: event.id })
        })
}
