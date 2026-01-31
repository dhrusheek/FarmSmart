import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { notFound } from '../../../utils/errors.js';

const createSchema = z.object({
  name: z.string().min(2).max(60),
  type: z.string().min(2).max(40),
  plantingDate: z.string().datetime(),
  status: z.string().min(2).max(40),
});

const patchSchema = createSchema.partial();

export const cropRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, async (req) => {
    const items = await app.prisma.crop.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return { items };
  });

  app.post('/', { preHandler: [app.authenticate] }, async (req) => {
    const body = createSchema.parse(req.body);
    const item = await app.prisma.crop.create({
      data: {
        userId: req.user.id,
        name: body.name,
        type: body.type,
        plantingDate: new Date(body.plantingDate),
        status: body.status,
      },
    });
    return { item };
  });

  app.patch('/:id', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const body = patchSchema.parse(req.body);

    const existing = await app.prisma.crop.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) throw notFound('Crop not found');

    const item = await app.prisma.crop.update({
      where: { id },
      data: {
        ...body,
        plantingDate: body.plantingDate ? new Date(body.plantingDate) : undefined,
      } as any,
    });
    return { item };
  });

  app.delete('/:id', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const existing = await app.prisma.crop.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) throw notFound('Crop not found');

    await app.prisma.crop.delete({ where: { id } });
    return { ok: true };
  });
};
