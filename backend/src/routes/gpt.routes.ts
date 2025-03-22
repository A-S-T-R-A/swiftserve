import { FastifyInstance } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import multipart from '@fastify/multipart';

export async function gptRoutes(fastify: FastifyInstance) {
    await fastify.register(multipart);

    fastify.post('/audio', async (request, reply) => {
        console.log("Received audio request");
        const parts = request.parts();

        let filePart: MultipartFile | null = null;
        const fields: Record<string, string> = {};

        for await (const part of parts) {
            console.log("Part", part);
            if (part.type === 'file') {
                filePart = part;
                console.log("File part done");
            } else {
                console.log("Field", part.fieldname);
                console.log("Value", part.value);

                fields[part.fieldname] = part.value as string;
                console.log("Setting field done")
            }
        }
        console.log("Validating fields");

        if (!filePart || !fields.model || !fields.response_format) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }
        console.log("Building form data")

        // Read the file stream into memory
        const buffer = await filePart.toBuffer();

        console.log("Buffer", buffer.length);

        // Create FormData object manually
        const formData = new FormData();
        formData.append('file', new Blob([buffer]), 'audio.webm');
        formData.append('model', fields.model);
        formData.append('response_format', fields.response_format);

        console.log("Sending audio to OpenAI");
        try {
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
                },
                body: formData as unknown as BodyInit,
            });
            console.log("Response from OpenAI", response);

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
            console.log("Sending completion to OpenAI");
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
            console.log("Response from OpenAI", response);
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