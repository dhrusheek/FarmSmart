import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { notFound } from '../../../utils/errors.js';

export const aiRoutes: FastifyPluginAsync = async (app) => {
  app.get('/models', async () => {
    const models = await app.prisma.aiModel.findMany({ orderBy: { lastTrained: 'desc' } });
    const items = models.map(m => ({
      id: m.id,
      name: m.name,
      version: m.version,
      accuracy: m.accuracy,
      lastTrained: m.lastTrained,
      status: m.status,
      drift: m.drift,
      predictions: safeJson(m.predictions),
    }));
    return { items };
  });

  app.post('/models/:id/retrain', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (req) => {
    const id = (req.params as any).id as string;
    const model = await app.prisma.aiModel.findUnique({ where: { id } });
    if (!model) throw notFound('Model not found');

    const job = await app.prisma.aiJob.create({
      data: {
        modelId: id,
        status: 'queued',
      }
    });

    return { jobId: job.id, status: job.status };
  });

  app.get('/jobs', async () => {
    const jobs = await app.prisma.aiJob.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { model: true } });
    const items = jobs.map(j => ({
      id: j.id,
      status: j.status,
      model: { id: j.model.id, name: j.model.name, version: j.model.version },
      createdAt: j.createdAt,
      updatedAt: j.updatedAt,
    }));
    return { items };
  });
};

function safeJson(v: any) {
  try {
    if (typeof v === 'string') return JSON.parse(v);
    return v;
  } catch {
    return v;
  }
}
