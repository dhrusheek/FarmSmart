# FarmSmart API (v1)

Base URL: `/api`

All error responses are:
```json
{ "message": "Human readable message" }
```

## Health
### GET `/health`
Response:
```json
{ "ok": true, "time": "2026-01-31T..." }
```

## Auth
### POST `/auth/register`
Body:
```json
{ "name": "Ravi", "email": "ravi@example.com", "password": "Password@123", "role": "farmer", "phone": "888..." }
```
Response:
```json
{ "user": { "id": "...", "email": "...", "role": "farmer" }, "token": "<JWT>" }
```

### POST `/auth/login`
Body:
```json
{ "email": "farmer@farmsmart.local", "password": "Password@123" }
```
Response:
```json
{ "user": { ... }, "token": "<JWT>" }
```

### GET `/auth/me` (Bearer token)
Response:
```json
{ "user": { ... } }
```

## Profile
### PATCH `/users/me` (Bearer token)
Body (any subset):
```json
{ "location": "Pune, MH", "preferredLanguage": "en" }
```

## Crops
### GET `/crops` (Bearer token)
Response:
```json
{ "items": [ { "id": "...", "name": "Tomato" } ] }
```

### POST `/crops` (Bearer token)
Body:
```json
{ "name": "Tomato", "type": "Vegetable", "plantingDate": "2026-01-01T00:00:00.000Z", "status": "Healthy" }
```

### PATCH `/crops/:id` (Bearer token)
### DELETE `/crops/:id` (Bearer token)

## Inventory
### GET `/inventory` (Bearer token)
### POST `/inventory` (Bearer token)
### PATCH `/inventory/:id` (Bearer token)
### DELETE `/inventory/:id` (Bearer token)

## Transactions
### GET `/transactions?from=&to=&type=&category=&cropId=` (Bearer token)
### POST `/transactions` (Bearer token)
Body:
```json
{ "date": "2026-01-31T00:00:00.000Z", "description": "Seed purchase", "type": "expense", "amount": 2200, "category": "Seeds", "cropId": "..." }
```
### DELETE `/transactions/:id` (Bearer token)

## Market
### GET `/market/prices?crop=&region=&freshness=`
Response:
```json
{ "items": [ { "crop": "Tomato", "currentPrice": 2800, "trend": [2600,2650,...] } ] }
```

## Auctions
### GET `/auctions?status=active|completed`

### POST `/auctions` (Bearer token, farmer/admin)
Body:
```json
{ "crop": "Tomato", "quantity": 20, "unit": "Quintal", "startingPrice": 2500, "minimumIncrement": 50, "endsAt": "2026-02-01T12:00:00.000Z" }
```

### POST `/auctions/:id/bids` (Bearer token, buyer/admin)
Body:
```json
{ "amount": 2550 }
```
Rules:
- amount >= currentBid + minimumIncrement
- anti-sniping: bids in last 10s extend endsAt by 60s
- fraud alerts auto-created for abnormal/rapid bidding

### POST `/auctions/:id/end` (Bearer token, seller/admin)

## Disputes
### GET `/disputes` (Bearer token)
Role visibility:
- admin: all
- user: disputes they raised
- farmer: also disputes on their auctions

### POST `/disputes` (Bearer token)
Body:
```json
{ "auctionId": "...", "againstUserId": "...", "title": "Quality mismatch", "description": "..." }
```

### PATCH `/disputes/:id` (Bearer token, admin)
Body:
```json
{ "status": "resolved", "resolutionNotes": "Refund issued" }
```

## Advisories
### GET `/advisories?targetCrop=&severity=&category=`

## AI
### GET `/ai/models`
### POST `/ai/models/:id/retrain`
### GET `/ai/jobs`

## Weather
### GET `/weather/current?lat=&lon=`
### GET `/weather/forecast?lat=&lon=`
