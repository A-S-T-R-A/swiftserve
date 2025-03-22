import fastify from 'fastify';
import cors from '@fastify/cors';
import { patientRoutes } from './routes/patient.routes';
import { appointmentRoutes } from './routes/appointment.routes';
import { gptRoutes } from './routes/gpt.routes';
const server = fastify({
    logger: true
});

server.register(cors, {
    origin: true
});

server.register(patientRoutes, { prefix: '/api/patients' });
server.register(appointmentRoutes, { prefix: '/api/appointments' });
server.register(gptRoutes, { prefix: '/api/gpt' });

server.get('/health', async () => {
    return { status: 'ok' };
});

const start = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server is running on http://localhost:3000');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start(); 