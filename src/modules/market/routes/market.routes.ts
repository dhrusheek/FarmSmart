import { FastifyPluginAsync } from 'fastify';

export const marketRoutes: FastifyPluginAsync = async (app) => {
  app.get('/prices', async (req) => {
    const q = req.query as any;
    const where: any = {};
    if (q.crop) where.crop = { contains: String(q.crop), mode: 'insensitive' };
    if (q.region) where.region = { contains: String(q.region), mode: 'insensitive' };
    if (q.freshness) where.freshness = q.freshness;

    const items = await app.prisma.marketPrice.findMany({
      where,
      orderBy: { lastUpdated: 'desc' },
      take: 100,
    });

    // trend is stored as JSON string for SQLite ease; return parsed array
    const normalized = items.map((i) => ({
      ...i,
      trend: safeParseTrend(i.trend as any),
    }));

    return { items: normalized };
  });
};

function safeParseTrend(value: any): number[] {
  try {
    if (Array.isArray(value)) return value.map(Number);
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(Number);
    }
  } catch (_) {}
  return [];
}
