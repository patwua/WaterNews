CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "memberships" TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CheckoutIntent" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "orgId" TEXT
);

CREATE TABLE "AuditLog" (
  "id" SERIAL PRIMARY KEY,
  "orgId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "OrgSubscription" ADD COLUMN "orgId" TEXT;
ALTER TABLE "OrgSubscription" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "OrgSubscription" ADD CONSTRAINT "OrgSubscription_checkoutIntentId_fkey" FOREIGN KEY ("checkoutIntentId") REFERENCES "CheckoutIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
