import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { forbidden, notFound } from '../../../utils/errors.js';
import { requireRole } from '../../../utils/guards.js';

const createSchema = z.object({
  auctionId: z.string().optional().nullable(),
  againstUserId: z.string().optional().nullable(),
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(600),
});

const patchSchema = z.object({
  status: z.enum(['open','in_review','resolved','rejected']),
  resolutionNotes: z.string().max(600).optional().nullable(),
});

export const disputeRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, async (req) => {
    const role = req.user.role;

    // Visibility rules:
    // - Admin: all
    // - Non-admin: disputes they raised
    // - Seller: also disputes related to their auctions
    const where: any = {};
    if (role !== 'admin') {
      where.OR = [{ raisedById: req.user.id }];
      // seller visibility
      if (role === 'farmer') {
        where.OR.push({
          auction: { sellerId: req.user.id }
        });
      }
    }

    const items = await app.prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        auction: true,
        raisedBy: { select: { id: true, name: true, role: true } },
        againstUser: { select: { id: true, name: true, role: true } },
      }
    });

    return { items };
  });

  app.post('/', { preHandler: [app.authenticate] }, async (req) => {
    const body = createSchema.parse(req.body);

    if (body.auctionId) {
      const auction = await app.prisma.auction.findUnique({ where: { id: body.auctionId } });
      if (!auction) throw notFound('Auction not found');
    }

    if (body.againstUserId) {
      const u = await app.prisma.user.findUnique({ where: { id: body.againstUserId } });
      if (!u) throw notFound('User not found');
    }

    const item = await app.prisma.dispute.create({
      data: {
        auctionId: body.auctionId ?? null,
        raisedById: req.user.id,
        againstUserId: body.againstUserId ?? null,
        title: body.title,
        description: body.description,
        status: 'open',
      }
    });

    return { item };
  });

  app.patch('/:id', { preHandler: [app.authenticate, requireRole(['admin'])] }, async (req) => {
    const id = (req.params as any).id as string;
    const body = patchSchema.parse(req.body);

    const existing = await app.prisma.dispute.findUnique({ where: { id } });
    if (!existing) throw notFound('Dispute not found');

    const item = await app.prisma.dispute.update({
      where: { id },
      data: {
        status: body.status,
        resolutionNotes: body.resolutionNotes ?? null,
      }
    });

    return { item };
  });
};
