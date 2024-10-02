import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const userPub = getCookie(event, "userPub");
  const ownerPub = process.env.NUXT_OWNER_PUB;
  // Validate required fields
  if (!userPub) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Pub!",
    });
  }

  const { DB } = event.context.cloudflare.env;
  const drizzleDb = drizzle(DB);

  // Update the lastActivity field to the current timestamp
  const currentMember: any = await drizzleDb
    .update(member)
    .set({ lastActivity: Date.now() })
    .where(eq(member.pub, userPub))
    .returning()
    .get();

  if (!currentMember) {
    throw createError({
      statusCode: 400,
      statusMessage: "User Not Found",
    });
  }
  // Determine the user role
  const userRole =
    userPub === ownerPub
      ? "Owner"
      : currentMember.isVerified
        ? "Verified"
        : "NewComer";

  return {
    isVerified: currentMember.isVerified,
    lastActivity: currentMember.lastActivity,
    ownerPub,
    userPub,
    role: userRole,
  };
});
