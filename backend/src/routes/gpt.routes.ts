import { FastifyInstance } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import multipart from '@fastify/multipart';

export async function gptRoutes(fastify: FastifyInstance) {
    await fastify.register(multipart);

    fastify.post('/audio', async (request, reply) => {
        const parts = request.parts();

        let filePart: MultipartFile | null = null;
        const fields: Record<string, string> = {};

        for await (const part of parts) {
            if (part.type === 'file') {
                filePart = part;
            } else {
                fields[part.fieldname] = part.value as string;
            }
        }

        if (!filePart || !fields.model || !fields.response_format) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }

        // Read the file stream into memory
        const buffer = await filePart.toBuffer();

        // Create FormData object manually
        const formData = new FormData();
        formData.append('file', new Blob([buffer]), 'audio.webm');
        formData.append('model', fields.model);
        formData.append('response_format', fields.response_format);

        try {
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
                },
                body: formData as unknown as BodyInit,
            });

            if (!response.ok) {
                const error = await response.text();
                return reply.status(response.status).send({ error });
            }

            const result = await response.text(); // or .json() if response_format is "json"
            return reply.send(result);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to process audio' });
        }
    });

    fastify.post('/completion', async (request, reply) => {
        const { messages, model = 'gpt-4o-mini' } = request.body as {
            messages: { role: string; content: string }[];
            model?: string;
        };

        if (!messages || !Array.isArray(messages)) {
            return reply.status(400).send({ error: 'Missing or invalid messages field' });
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    messages,
                    model,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                return reply.status(response.status).send({ error });
            }

            const data = await response.json();
            return reply.send(data);
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to get completion' });
        }
    });
} 