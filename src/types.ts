import { z } from 'zod';

export const EventPayloadSchema = z.object({
  id: z.string().uuid(),
  channel: z.string().min(1).max(64),
  eventType: z.enum(['broadcast', 'direct', 'heartbeat']),
  data: z.record(z.unknown()),
  timestamp: z.number().default(() => Date.now()),
});

export type EventPayload = z.infer<typeof EventPayloadSchema>;

export interface ClientConnection {
  id: string;
  channels: Set<string>;
  connectedAt: Date;
}
