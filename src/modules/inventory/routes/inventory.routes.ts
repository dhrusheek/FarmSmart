import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { notFound } from '../../../utils/errors.js';

const createSchema = z.object({
  name: z.string().min(2).max(80),
  category: z.string().min(2).max(40),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1).max(20),
  location: z.string().min(2).max(80),
  minStock: z.number().nonnegative(),
});
const patchSchema = createSchema.partial();

export const inventoryRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, async (req) => {
    const items = await app.prisma.inventoryItem.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return { items };
  });

  app.post('/', { preHandler: [app.authenticate] }, async (req) => {
    const body = createSchema.parse(req.body);
    const item = await app.prisma.inventoryItem.create({
      data: { userId: req.user.id, ...body },
    });
    return { item };
  });

  app.patch('/:id', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const body = patchSchema.parse(req.body);

    const existing = await app.prisma.inventoryItem.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) throw notFound('Inventory item not found');

    const item = await app.prisma.inventoryItem.update({ where: { id }, data: body });
    return { item };
  });

  app.delete('/:id', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const existing = await app.prisma.inventoryItem.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) throw notFound('Inventory item not found');

    await app.prisma.inventoryItem.delete({ where: { id } });
    return { ok: true };
  });
};
