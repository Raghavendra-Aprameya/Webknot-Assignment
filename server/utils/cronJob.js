import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule("*/5 * * * *", async () => {
  try {
    const expirationDate = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const deleted = await prisma.oTP.deleteMany({
      where: { createdAt: { lt: expirationDate } },
    });
    console.log(`${deleted.count} expired OTP's deleted`);
  } catch (err) {
    console.log("Problem occured while deletion");
  }
});
