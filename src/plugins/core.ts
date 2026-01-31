import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { FastifyPluginAsync } from 'fastify';
import { env } from '../utils/env.js';

export const corePlugin: FastifyPluginAsync = async (app) => {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  });

  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: '1 minute'
  });
};
