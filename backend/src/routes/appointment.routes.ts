import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { generateAppointmentPDF } from '../utils/pdfGenerator';

interface AppointmentInput {
    patientId: number;
    reason: string;
    diagnosis?: string;
    prescription?: string;
    bp?: number;
    heartRate?: number;
    weight?: number;
    height?: number;
    notes?: string;
}

interface AppointmentPatchInput {
    reason?: string;
    diagnosis?: string;
    prescription?: string;
    bp?: number;
    heartRate?: number;
    weight?: number;
    height?: number;
    notes?: string;
}

export async function appointmentRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return await prisma.appointment.findMany({
            include: { patient: true },
            orderBy: { createdAt: 'desc' }
        });
    });

    fastify.get('/patient/:patientId', async (request, reply) => {
        const { patientId } = request.params as { patientId: string };

        const patient = await prisma.patient.findUnique({
            where: { id: Number(patientId) }
        });

        if (!patient) {
            return reply.code(404).send({ error: 'Patient not found' });
        }

        return await prisma.appointment.findMany({
            where: { patientId: Number(patientId) },
            orderBy: { createdAt: 'desc' }
        });
    });

    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        const appointment = await prisma.appointment.findUnique({
            where: { id: Number(id) },
            include: { patient: true }
        });

        if (!appointment) {
            return reply.code(404).send({ error: 'Appointment not found' });
        }

        return appointment;
    });

    fastify.get('/:id/pdf', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            const appointment = await prisma.appointment.findUnique({
                where: { id: Number(id) },
                include: { patient: true }
            });

            if (!appointment) {
                return reply.code(404).send({ error: 'Appointment not found' });
            }

            const pdfBuffer = await generateAppointmentPDF(appointment);

            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', `attachment; filename="appointment.pdf"`);

            return reply.send(pdfBuffer);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to generate PDF' });
        }
    });

    fastify.post('/', async (request, reply) => {
        const appointmentData = request.body as AppointmentInput;

        try {
            const patient = await prisma.patient.findUnique({
                where: { id: appointmentData.patientId }
            });

            if (!patient) {
                return reply.code(400).send({ error: 'Patient not found' });
            }

            const appointment = await prisma.appointment.create({
                data: appointmentData,
                include: { patient: true }
            });

            return reply.code(201).send(appointment);
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to create appointment' });
        }
    });

    fastify.patch('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const appointmentData = request.body as AppointmentPatchInput;

        try {
            const updatedAppointment = await prisma.appointment.update({
                where: { id: Number(id) },
                data: appointmentData,
                include: { patient: true }
            });

            return updatedAppointment;
        } catch (error) {
            return reply.code(404).send({ error: 'Appointment not found' });
        }
    });

    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await prisma.appointment.delete({
                where: { id: Number(id) }
            });

            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ error: 'Appointment not found or cannot be deleted' });
        }
    });
} 