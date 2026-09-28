import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { EventPayloadSchema } from './types';

export function createServer() {
  const app = Fastify({ logger: true });

  app.register(fastifyWebsocket);

  app.get('/healthz', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  });

  app.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection) => {
      connection.socket.on('message', (message: Buffer) => {
        try {
          const raw = JSON.parse(message.toString());
          const event = EventPayloadSchema.parse(raw);
          connection.socket.send(JSON.stringify({ ack: event.id, status: 'delivered' }));
        } catch {
          connection.socket.send(JSON.stringify({ error: 'invalid_event_schema' }));
        }
      });
    });
  });

  return app;
}
