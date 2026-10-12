/* Usage: npm run admin:create -- email@example.com "Full Name" 'password'
   Creates the account, or resets the password if it already exists. */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password || password.length < 10) {
  console.error('Usage: npm run admin:create -- <email> "<name>" <password (10+ chars)>');
  process.exit(1);
}
const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash(password, 12);
await prisma.adminUser.upsert({ where: { email: email.toLowerCase() }, create: { email: email.toLowerCase(), name, passwordHash }, update: { name, passwordHash } });
console.log(`Admin ${email} ready.`);
await prisma.$disconnect();
