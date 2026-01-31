-- Prisma-style init migration for SQLite
PRAGMA foreign_keys=OFF;

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'farmer',
  "location" TEXT,
  "farmSize" TEXT,
  "preferredLanguage" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Crop" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "plantingDate" DATETIME NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Crop_userId_idx" ON "Crop"("userId");

CREATE TABLE "InventoryItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "quantity" REAL NOT NULL,
  "unit" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "minStock" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "InventoryItem_userId_idx" ON "InventoryItem"("userId");

CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "date" DATETIME NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "category" TEXT NOT NULL,
  "cropId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_cropId_idx" ON "Transaction"("cropId");
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

CREATE TABLE "MarketPrice" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "crop" TEXT NOT NULL,
  "currentPrice" REAL NOT NULL,
  "unit" TEXT NOT NULL,
  "change" REAL NOT NULL,
  "trend" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT 0,
  "source" TEXT NOT NULL,
  "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "freshness" TEXT NOT NULL DEFAULT 'recent'
);
CREATE INDEX "MarketPrice_crop_idx" ON "MarketPrice"("crop");
CREATE INDEX "MarketPrice_region_idx" ON "MarketPrice"("region");
CREATE INDEX "MarketPrice_freshness_idx" ON "MarketPrice"("freshness");

CREATE TABLE "Auction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sellerId" TEXT NOT NULL,
  "crop" TEXT NOT NULL,
  "quantity" REAL NOT NULL,
  "unit" TEXT NOT NULL,
  "startingPrice" REAL NOT NULL,
  "currentBid" REAL NOT NULL DEFAULT 0,
  "minimumIncrement" REAL NOT NULL DEFAULT 1,
  "endsAt" DATETIME NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Auction_sellerId_idx" ON "Auction"("sellerId");
CREATE INDEX "Auction_status_idx" ON "Auction"("status");
CREATE INDEX "Auction_endsAt_idx" ON "Auction"("endsAt");

CREATE TABLE "Bid" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "auctionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Bid_auctionId_idx" ON "Bid"("auctionId");
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");
CREATE INDEX "Bid_timestamp_idx" ON "Bid"("timestamp");

CREATE TABLE "FraudAlert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "auctionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "FraudAlert_auctionId_idx" ON "FraudAlert"("auctionId");
CREATE INDEX "FraudAlert_userId_idx" ON "FraudAlert"("userId");
CREATE INDEX "FraudAlert_type_idx" ON "FraudAlert"("type");

CREATE TABLE "Dispute" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "auctionId" TEXT,
  "raisedById" TEXT NOT NULL,
  "againstUserId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "resolutionNotes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY ("raisedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("againstUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Dispute_auctionId_idx" ON "Dispute"("auctionId");
CREATE INDEX "Dispute_raisedById_idx" ON "Dispute"("raisedById");
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");

CREATE TABLE "Advisory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "targetCrop" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "symptoms" TEXT NOT NULL,
  "management" TEXT NOT NULL,
  "prevention" TEXT NOT NULL
);
CREATE INDEX "Advisory_targetCrop_idx" ON "Advisory"("targetCrop");
CREATE INDEX "Advisory_category_idx" ON "Advisory"("category");
CREATE INDEX "Advisory_severity_idx" ON "Advisory"("severity");

CREATE TABLE "AiModel" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "accuracy" REAL NOT NULL,
  "lastTrained" DATETIME NOT NULL,
  "status" TEXT NOT NULL,
  "drift" REAL NOT NULL,
  "predictions" TEXT NOT NULL
);
CREATE INDEX "AiModel_name_idx" ON "AiModel"("name");

CREATE TABLE "AiJob" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "modelId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("modelId") REFERENCES "AiModel"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "AiJob_modelId_idx" ON "AiJob"("modelId");
CREATE INDEX "AiJob_status_idx" ON "AiJob"("status");

PRAGMA foreign_keys=ON;
