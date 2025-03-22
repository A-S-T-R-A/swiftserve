import { FastifyInstance } from 'fastify';
import prisma from '../db';

interface PatientInput {
    name: string;
    surname: string;
    phone: string;
    other?: string;
}

interface PatientPatchInput {
    name?: string;
    surname?: string;
    phone?: string;
    other?: string;
}


export async function patientRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return await prisma.patient.findMany({
            orderBy: { createdAt: 'desc' }
        });
    });

    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        const patient = await prisma.patient.findUnique({
            where: { id: Number(id) },
            include: { appointments: true }
        });

        if (!patient) {
            return reply.code(404).send({ error: 'Patient not found' });
        }

        return patient;
    });

    fastify.post('/', async (request, reply) => {
        const patientData = request.body as PatientInput;

        const patient = await prisma.patient.create({
            data: patientData
        });

        return reply.code(201).send(patient);
    });

    fastify.patch('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const patientData = request.body as PatientPatchInput;

        try {
            const updatedPatient = await prisma.patient.update({
                where: { id: Number(id) },
                data: patientData
            });

            return updatedPatient;
        } catch (error) {
            return reply.code(404).send({ error: 'Patient not found' });
        }
    });

    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await prisma.patient.delete({
                where: { id: Number(id) }
            });

            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ error: 'Patient not found or cannot be deleted' });
        }
    });
} 