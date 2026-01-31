import { FastifyPluginAsync } from 'fastify';

export const advisoryRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (req) => {
    const q = req.query as any;
    const where: any = {};
    if (q.targetCrop) where.targetCrop = { contains: String(q.targetCrop), mode: 'insensitive' };
    if (q.severity) where.severity = q.severity;
    if (q.category) where.category = q.category;

    const items = await app.prisma.advisory.findMany({
      where,
      orderBy: { severity: 'desc' },
      take: 100,
    });

    return { items };
  });
};
