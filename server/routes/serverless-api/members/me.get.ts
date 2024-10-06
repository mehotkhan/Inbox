import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const userPub = getCookie(event, "userPub");
  // Validate required fields
  if (!userPub) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing Pub!",
    });
  }

  const { DB, OWNER_PUB } = event.context.cloudflare.env;
  const owners: string[] = OWNER_PUB.split(",");

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
  const userRole = owners.includes(userPub)
    ? "Owner"
    : currentMember.isVerified
      ? "Verified"
      : "NewComer";

  return {
    isVerified: currentMember.isVerified,
    lastActivity: currentMember.lastActivity,
    OWNER_PUB,
    role: userRole,
  };
});
