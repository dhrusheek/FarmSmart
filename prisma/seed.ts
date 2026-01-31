import { PrismaClient, Role, TransactionType, AuctionStatus, DisputeStatus, AdvisoryCategory, AdvisorySeverity, MarketFreshness } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  // Clean (dev friendly)
  await prisma.bid.deleteMany();
  await prisma.fraudAlert.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.advisory.deleteMany();
  await prisma.aiJob.deleteMany();
  await prisma.aiModel.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@farmsmart.local',
      phone: '9999999999',
      role: Role.admin,
      passwordHash,
      location: 'HQ',
      preferredLanguage: 'en'
    }
  });

  const farmer = await prisma.user.create({
    data: {
      name: 'Ravi Farmer',
      email: 'farmer@farmsmart.local',
      phone: '8888888888',
      role: Role.farmer,
      passwordHash,
      location: 'Pune, MH',
      farmSize: '5 acres',
      preferredLanguage: 'en'
    }
  });

  const buyer = await prisma.user.create({
    data: {
      name: 'Asha Buyer',
      email: 'buyer@farmsmart.local',
      phone: '7777777777',
      role: Role.buyer,
      passwordHash,
      location: 'Mumbai, MH',
      preferredLanguage: 'en'
    }
  });

  const crops = await prisma.crop.createMany({
    data: [
      {
        userId: farmer.id,
        name: 'Tomato',
        type: 'Vegetable',
        plantingDate: daysFromNow(-45),
        status: 'Healthy'
      },
      {
        userId: farmer.id,
        name: 'Wheat',
        type: 'Grain',
        plantingDate: daysFromNow(-120),
        status: 'Needs Water'
      }
    ]
  });

  const tomato = await prisma.crop.findFirst({ where: { userId: farmer.id, name: 'Tomato' } });
  const wheat = await prisma.crop.findFirst({ where: { userId: farmer.id, name: 'Wheat' } });

  await prisma.inventoryItem.createMany({
    data: [
      {
        userId: farmer.id,
        name: 'Tomato Seeds',
        category: 'Seeds',
        quantity: 4,
        unit: 'kg',
        location: 'Main Shed',
        minStock: 2
      },
      {
        userId: farmer.id,
        name: 'NPK Fertilizer',
        category: 'Fertilizer',
        quantity: 12,
        unit: 'bags',
        location: 'Main Shed',
        minStock: 5
      },
      {
        userId: farmer.id,
        name: 'Sprayer Pump',
        category: 'Equipment',
        quantity: 1,
        unit: 'unit',
        location: 'Tool Room',
        minStock: 1
      }
    ]
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: farmer.id,
        date: daysFromNow(-7),
        description: 'Seed purchase',
        type: TransactionType.expense,
        amount: 2200,
        category: 'Seeds',
        cropId: tomato?.id
      },
      {
        userId: farmer.id,
        date: daysFromNow(-2),
        description: 'Local market sale',
        type: TransactionType.income,
        amount: 8500,
        category: 'Produce',
        cropId: wheat?.id
      }
    ]
  });

  await prisma.marketPrice.createMany({
    data: [
      {
        crop: 'Tomato',
        currentPrice: 2800,
        unit: 'Quintal',
        change: 120,
        trend: JSON.stringify([2600, 2650, 2700, 2750, 2800]),
        region: 'Pune',
        verified: true,
        source: 'Local Mandi',
        lastUpdated: new Date(),
        freshness: MarketFreshness.live
      },
      {
        crop: 'Wheat',
        currentPrice: 2300,
        unit: 'Quintal',
        change: -40,
        trend: JSON.stringify([2400, 2380, 2350, 2320, 2300]),
        region: 'Pune',
        verified: false,
        source: 'Aggregator',
        lastUpdated: new Date(),
        freshness: MarketFreshness.recent
      }
    ]
  });

  await prisma.advisory.createMany({
    data: [
      {
        title: 'Early blight warning',
        category: AdvisoryCategory.Disease,
        targetCrop: 'Tomato',
        severity: AdvisorySeverity.Medium,
        symptoms: 'Dark concentric spots on older leaves, yellowing around spots.',
        management: 'Remove infected leaves, avoid overhead irrigation, apply recommended fungicide as per label.',
        prevention: 'Crop rotation, disease-free seed, maintain plant spacing for airflow.'
      },
      {
        title: 'Aphid spike expected',
        category: AdvisoryCategory.Pest,
        targetCrop: 'Wheat',
        severity: AdvisorySeverity.High,
        symptoms: 'Sticky honeydew, curling leaves, stunted growth.',
        management: 'Use yellow sticky traps; apply safe insecticidal soap or recommended insecticide if threshold is crossed.',
        prevention: 'Monitor weekly, keep field edges clean, encourage beneficial insects.'
      }
    ]
  });

  const auction = await prisma.auction.create({
    data: {
      sellerId: farmer.id,
      crop: 'Tomato',
      quantity: 20,
      unit: 'Quintal',
      startingPrice: 2500,
      currentBid: 2500,
      minimumIncrement: 50,
      endsAt: daysFromNow(1),
      status: AuctionStatus.active
    }
  });

  await prisma.bid.create({
    data: {
      auctionId: auction.id,
      userId: buyer.id,
      amount: 2550
    }
  });

  await prisma.auction.update({
    where: { id: auction.id },
    data: { currentBid: 2550 }
  });

  await prisma.dispute.create({
    data: {
      auctionId: auction.id,
      raisedById: buyer.id,
      againstUserId: farmer.id,
      title: 'Quality mismatch',
      description: 'Delivered lot quality did not match listing photos.',
      status: DisputeStatus.open
    }
  });

  const model = await prisma.aiModel.create({
    data: {
      name: 'Yield Predictor',
      version: 'v1.0',
      accuracy: 0.87,
      lastTrained: daysFromNow(-14),
      status: 'ready',
      drift: 0.12,
      predictions: JSON.stringify({ next7d: { tomato: 0.62, wheat: 0.41 } })
    }
  });

  await prisma.aiJob.create({
    data: {
      modelId: model.id,
      status: 'completed'
    }
  });

  console.log('Seeded users:', { admin: admin.email, farmer: farmer.email, buyer: buyer.email });
  console.log('Demo password for all:', 'Password@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  .finally(async () => {
    await prisma.$disconnect();
  });
