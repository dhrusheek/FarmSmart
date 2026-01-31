import { PrismaClient } from '@prisma/client';

export async function placeBid(params: {
  prisma: PrismaClient;
  auctionId: string;
  bidderId: string;
  amount: number;
}) {
  const { prisma, auctionId, bidderId, amount } = params;

  const auction = await prisma.auction.findUnique({ where: { id: auctionId }, include: { bids: { orderBy: { timestamp: 'desc' }, take: 10 } } });
  if (!auction) return { error: { status: 404, message: 'Auction not found' } };
  if (auction.status !== 'active') return { error: { status: 400, message: 'Auction is not active' } };

  const now = new Date();
  if (auction.endsAt.getTime() <= now.getTime()) {
    return { error: { status: 400, message: 'Auction already ended' } };
  }

  const current = auction.currentBid && auction.currentBid > 0 ? auction.currentBid : auction.startingPrice;
  const minOk = amount >= current + auction.minimumIncrement;
  if (!minOk) {
    return { error: { status: 400, message: `Bid must be at least ${current + auction.minimumIncrement}` } };
  }

  const fraudAlerts: Array<{ type: 'abnormal_bid' | 'rapid_bidding'; message: string }> = [];

  // Fraud rule 1: deviation > 30% from starting price
  if (amount > auction.startingPrice * 1.3) {
    fraudAlerts.push({
      type: 'abnormal_bid',
      message: `Bid is >30% above starting price (start=${auction.startingPrice}, bid=${amount})`
    });
  }

  // Fraud rule 2: same user > 3 bids within last 60s
  const recentBySameUser = auction.bids.filter(b => b.userId === bidderId && (now.getTime() - b.timestamp.getTime()) <= 60_000);
  if (recentBySameUser.length >= 3) {
    fraudAlerts.push({
      type: 'rapid_bidding',
      message: 'More than 3 bids in the last 60 seconds by the same buyer'
    });
  }

  // Anti-sniping: if bid in last 10s, extend by 60s
  let newEndsAt = auction.endsAt;
  if (auction.endsAt.getTime() - now.getTime() <= 10_000) {
    newEndsAt = new Date(auction.endsAt.getTime() + 60_000);
  }

  const result = await prisma.$transaction(async (tx) => {
    const bid = await tx.bid.create({
      data: {
        auctionId: auction.id,
        userId: bidderId,
        amount,
        timestamp: now,
      }
    });

    const updatedAuction = await tx.auction.update({
      where: { id: auction.id },
      data: {
        currentBid: amount,
        endsAt: newEndsAt,
      }
    });

    const createdAlerts = [] as any[];
    for (const alert of fraudAlerts) {
      const created = await tx.fraudAlert.create({
        data: {
          auctionId: auction.id,
          userId: bidderId,
          type: alert.type,
          message: alert.message,
          timestamp: now,
        }
      });
      createdAlerts.push(created);
    }

    return { bid, auction: updatedAuction, fraudAlerts: createdAlerts };
  });

  return { ...result };
}
