-- Add check constraints
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_minor_positive" CHECK ("amountMinor" > 0);
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_limit_minor_positive" CHECK ("limitMinor" > 0);

-- Partial indexes excluding soft-deleted transactions
CREATE INDEX "transactions_userId_occurredOn_id_active_idx" ON "transactions"("userId", "occurredOn" DESC, "id" DESC) WHERE "deletedAt" IS NULL;
CREATE INDEX "transactions_userId_categoryId_occurredOn_active_idx" ON "transactions"("userId", "categoryId", "occurredOn") WHERE "deletedAt" IS NULL;
CREATE INDEX "transactions_userId_kind_occurredOn_active_idx" ON "transactions"("userId", "kind", "occurredOn") WHERE "deletedAt" IS NULL;
