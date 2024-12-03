import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                summary: 'Fazer check-in de um participante',
                tags: ['check-ins'],
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response: {
                    201: z.null(),
                }
            }
        }, async (request, reply) => {
            const { attendeeId } = request.params


            const attendeeCheckIn = await prisma.checkIn.findUnique({
                where: {
                    attendeeId
                }
            })

            if(attendeeCheckIn !== null) {
                throw new BadRequest("O participante já fez check-in!")
            }

            await prisma.checkIn.create({
                data: {
                    attendeeId,
                }
            })

            return reply.status(201).send()
        })

}