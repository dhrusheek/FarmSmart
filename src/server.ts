import Fastify from 'fastify';
import { env } from './utils/env.js';
import { HttpError } from './utils/errors.js';
import { corePlugin } from './plugins/core.js';
import { prismaPlugin } from './plugins/prisma.js';
import { authPlugin } from './plugins/auth.js';

import { authRoutes } from './modules/auth/routes/auth.routes.js';
import { userRoutes } from './modules/users/routes/users.routes.js';
import { cropRoutes } from './modules/crops/routes/crops.routes.js';
import { inventoryRoutes } from './modules/inventory/routes/inventory.routes.js';
import { transactionRoutes } from './modules/transactions/routes/transactions.routes.js';
import { marketRoutes } from './modules/market/routes/market.routes.js';
import { auctionRoutes } from './modules/auctions/routes/auctions.routes.js';
import { disputeRoutes } from './modules/disputes/routes/disputes.routes.js';
import { advisoryRoutes } from './modules/advisories/routes/advisories.routes.js';
import { aiRoutes } from './modules/ai/routes/ai.routes.js';
import { weatherRoutes } from './modules/weather/routes/weather.routes.js';

const app = Fastify({
  logger: true,
});

app.setErrorHandler((error, _req, reply) => {
  if (error instanceof HttpError) {
    reply.status(error.statusCode).send({ message: error.message });
    return;
  }

  // Zod validation errors (commonly thrown as error with name ZodError)
  if ((error as any).name === 'ZodError') {
    const msg = (error as any).issues?.[0]?.message || 'Validation error';
    reply.status(400).send({ message: msg });
    return;
  }

  app.log.error(error);
  reply.status(500).send({ message: 'Internal server error' });
});

await app.register(corePlugin);
await app.register(prismaPlugin);
await app.register(authPlugin);

app.get('/api/health', async () => {
  return { ok: true, time: new Date().toISOString() };
});

await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(userRoutes, { prefix: '/api/users' });
await app.register(cropRoutes, { prefix: '/api/crops' });
await app.register(inventoryRoutes, { prefix: '/api/inventory' });
await app.register(transactionRoutes, { prefix: '/api/transactions' });
await app.register(marketRoutes, { prefix: '/api/market' });
await app.register(auctionRoutes, { prefix: '/api/auctions' });
await app.register(disputeRoutes, { prefix: '/api/disputes' });
await app.register(advisoryRoutes, { prefix: '/api/advisories' });
await app.register(aiRoutes, { prefix: '/api/ai' });
await app.register(weatherRoutes, { prefix: '/api/weather' });

try {
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
