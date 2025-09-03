import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function activateSubscriptionFromIntent(
  checkoutIntentId: string,
  orgId?: string,
) {
  const intent = await prisma.checkoutIntent.findUnique({
    where: { id: checkoutIntentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          memberships: true,
        },
      },
    },
  });

  if (!intent) throw new Error("Checkout intent not found");

  const resolvedOrgId =
    orgId ??
    intent.orgId ??
    (intent.user.memberships.length === 1
      ? intent.user.memberships[0]
      : undefined);

  const status = resolvedOrgId ? "active" : "pending_assignment";

  const subscription = await prisma.orgSubscription.upsert({
    where: { checkoutIntentId },
    update: { orgId: resolvedOrgId, status },
    create: {
      orgId: resolvedOrgId,
      checkoutIntentId,
      status,
    },
  });

  if (resolvedOrgId) {
    await prisma.auditLog.create({
      data: {
        orgId: resolvedOrgId,
        action: "SUBSCRIPTION_CREATED",
        userId: intent.user.id,
      },
    });
  }

  return subscription;
}
