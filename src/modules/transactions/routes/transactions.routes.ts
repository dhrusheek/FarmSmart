import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { notFound } from '../../../utils/errors.js';

const createSchema = z.object({
  date: z.string().datetime(),
  description: z.string().min(2).max(120),
  type: z.enum(['income','expense']),
  amount: z.number().positive(),
  category: z.string().min(2).max(40),
  cropId: z.string().optional().nullable(),
});

export const transactionRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, async (req) => {
    const q = req.query as any;
    const where: any = { userId: req.user.id };
    if (q.type) where.type = q.type;
    if (q.category) where.category = q.category;
    if (q.cropId) where.cropId = q.cropId;
    if (q.from || q.to) {
      where.date = {};
      if (q.from) where.date.gte = new Date(q.from);
      if (q.to) where.date.lte = new Date(q.to);
    }

    const items = await app.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { crop: true },
    });
    return { items };
  });

  app.post('/', { preHandler: [app.authenticate] }, async (req) => {
    const body = createSchema.parse(req.body);

    if (body.cropId) {
      const crop = await app.prisma.crop.findFirst({ where: { id: body.cropId, userId: req.user.id } });
      if (!crop) throw notFound('Crop not found for this user');
    }

    const item = await app.prisma.transaction.create({
      data: {
        userId: req.user.id,
        date: new Date(body.date),
        description: body.description,
        type: body.type,
        amount: body.amount,
        category: body.category,
        cropId: body.cropId ?? null,
      }
    });

    return { item };
  });

  app.delete('/:id', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const existing = await app.prisma.transaction.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) throw notFound('Transaction not found');
    await app.prisma.transaction.delete({ where: { id } });
    return { ok: true };
  });
};
