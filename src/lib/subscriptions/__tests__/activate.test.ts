import { mock, test } from 'node:test';
import assert from 'node:assert/strict';

mock.module('@prisma/client', () => {
  class PrismaClient {
    checkoutIntent = { findUnique: async () => null };
    orgSubscription = { upsert: async () => null };
    auditLog = { create: async () => null };
  }
  return { PrismaClient };
});

const { activateSubscriptionFromIntent, prisma } = await import('../activate.ts');

test('auto-populates orgId from single membership', async (t) => {
  t.mock.method(prisma.checkoutIntent, 'findUnique', async () => ({
    id: 'chk1',
    orgId: undefined,
    user: { id: 'user1', email: 'u@example.com', memberships: ['org1'] },
  }));

  let captured: any;
  t.mock.method(prisma.orgSubscription, 'upsert', async (args) => {
    captured = args.create;
    return { ...args.create };
  });

  const audit = t.mock.method(prisma.auditLog, 'create', async () => ({}));

  const subscription = await activateSubscriptionFromIntent('chk1');

  assert.equal(captured.orgId, 'org1');
  assert.equal(captured.status, 'active');
  assert.equal(typeof captured.activatedAt, 'string');
  assert.equal(audit.mock.callCount(), 1);
  assert.equal(subscription.orgId, 'org1');
  assert.equal(subscription.activatedAt, captured.activatedAt);
});

test('pending status when multiple memberships', async (t) => {
  t.mock.method(prisma.checkoutIntent, 'findUnique', async () => ({
    id: 'chk2',
    orgId: undefined,
    user: { id: 'user1', email: 'u@example.com', memberships: ['org1', 'org2'] },
  }));

  let captured: any;
  t.mock.method(prisma.orgSubscription, 'upsert', async (args) => {
    captured = args.create;
    return { ...args.create };
  });

  const audit = t.mock.method(prisma.auditLog, 'create', async () => ({}));

  const subscription = await activateSubscriptionFromIntent('chk2');

  assert.equal(captured.status, 'pending_assignment');
  assert.equal(captured.activatedAt, undefined);
  assert.equal(audit.mock.callCount(), 0);
  assert.equal(subscription.status, 'pending_assignment');
  assert.equal(subscription.activatedAt, undefined);
});
