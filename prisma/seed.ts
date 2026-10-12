/* Seeds the site figures, the university list and the first admin account. Safe to re-run. */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_STATS, DEFAULT_UNIVERSITIES } from '../src/lib/defaults';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteStats.upsert({ where: { id: 1 }, create: { id: 1, ...DEFAULT_STATS }, update: {} });

  if ((await prisma.university.count()) === 0) {
    await prisma.university.createMany({ data: DEFAULT_UNIVERSITIES });
    console.log(`Added ${DEFAULT_UNIVERSITIES.length} universities.`);
  }

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const exists = await prisma.adminUser.findUnique({ where: { email } });
    if (!exists) {
      await prisma.adminUser.create({
        data: { email, name: process.env.ADMIN_NAME || 'Admin', passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`Created admin ${email}.`);
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin created.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
