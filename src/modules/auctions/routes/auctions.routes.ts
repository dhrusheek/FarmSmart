import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { forbidden, notFound } from '../../../utils/errors.js';
import { requireRole } from '../../../utils/guards.js';
import { placeBid } from '../services/auction.service.js';

const createAuctionSchema = z.object({
  crop: z.string().min(2).max(60),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(20),
  startingPrice: z.number().positive(),
  minimumIncrement: z.number().positive().default(1),
  endsAt: z.string().datetime(),
});

const bidSchema = z.object({
  amount: z.number().positive(),
});

export const auctionRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (req) => {
    const q = req.query as any;
    const where: any = {};
    if (q.status) where.status = q.status;

    const items = await app.prisma.auction.findMany({
      where,
      orderBy: { endsAt: 'asc' },
      include: {
        seller: { select: { id: true, name: true, location: true } },
        bids: { orderBy: { timestamp: 'desc' }, take: 5, include: { user: { select: { id: true, name: true } } } },
      }
    });

    return { items };
  });

  app.post('/', { preHandler: [app.authenticate, requireRole(['farmer','admin'])] }, async (req) => {
    const body = createAuctionSchema.parse(req.body);
    const item = await app.prisma.auction.create({
      data: {
        sellerId: req.user.id,
        crop: body.crop,
        quantity: body.quantity,
        unit: body.unit,
        startingPrice: body.startingPrice,
        currentBid: body.startingPrice,
        minimumIncrement: body.minimumIncrement,
        endsAt: new Date(body.endsAt),
        status: 'active',
      }
    });
    return { item };
  });

  app.post('/:id/bids', { preHandler: [app.authenticate, requireRole(['buyer','admin'])], config: { rateLimit: { max: 30, timeWindow: '1 minute' } } }, async (req, reply) => {
    const auctionId = (req.params as any).id as string;
    const body = bidSchema.parse(req.body);

    const res = await placeBid({ prisma: app.prisma, auctionId, bidderId: req.user.id, amount: body.amount });
    if ((res as any).error) {
      const e = (res as any).error;
      return reply.status(e.status).send({ message: e.message });
    }

    return { auction: (res as any).auction, bid: (res as any).bid, fraudAlertsCreated: (res as any).fraudAlerts };
  });

  app.post('/:id/end', { preHandler: [app.authenticate] }, async (req) => {
    const id = (req.params as any).id as string;
    const auction = await app.prisma.auction.findUnique({ where: { id } });
    if (!auction) throw notFound('Auction not found');

    const isSeller = auction.sellerId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isSeller && !isAdmin) throw forbidden('Only the seller (or admin) can end this auction');

    const updated = await app.prisma.auction.update({ where: { id }, data: { status: 'completed' } });
    return { item: updated };
  });
};
