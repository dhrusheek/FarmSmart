import { FastifyReply, FastifyRequest } from 'fastify';
import { forbidden } from './errors.js';

export function requireRole(roles: Array<'farmer' | 'buyer' | 'admin'>) {
  return async (req: FastifyRequest, _reply: FastifyReply) => {
    const role = (req as any).user?.role;
    if (!role || !roles.includes(role)) {
      throw forbidden('You do not have permission to perform this action');
    }
  };
}
