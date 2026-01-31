import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { badRequest, unauthorized } from '../../../utils/errors.js';

const patchSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().min(8).max(20).optional(),
  location: z.string().max(80).optional(),
  farmSize: z.string().max(40).optional(),
  preferredLanguage: z.string().max(5).optional(),
});

function publicUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    location: u.location,
    farmSize: u.farmSize,
    preferredLanguage: u.preferredLanguage,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.patch('/me', { preHandler: [app.authenticate] }, async (req) => {
    const body = patchSchema.parse(req.body);

    if (body.phone) {
      const other = await app.prisma.user.findFirst({
        where: { phone: body.phone, NOT: { id: req.user.id } },
      });
      if (other) throw badRequest('Phone number is already in use');
    }

    const updated = await app.prisma.user.update({
      where: { id: req.user.id },
      data: body,
    }).catch(() => null);

    if (!updated) throw unauthorized('User not found');
    return { user: publicUser(updated) };
  });
};
