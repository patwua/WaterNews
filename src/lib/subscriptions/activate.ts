import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function activateSubscriptionFromIntent(
  checkoutIntentId: string,
  orgId: string,
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

  const subscription = await prisma.orgSubscription.upsert({
    where: { checkoutIntentId },
    update: {},
    create: {
      orgId,
      checkoutIntentId,
    },
  });

  await prisma.auditLog.create({
    data: {
      orgId,
      action: "SUBSCRIPTION_CREATED",
      userId: intent.user.id,
    },
  });

  return subscription;
}
