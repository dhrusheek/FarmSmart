import { z, ZodSchema } from 'zod';
import { badRequest } from './errors.js';

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => i.message).join('; ');
    throw badRequest(msg || 'Invalid request');
  }
  return parsed.data;
}

export { z };
