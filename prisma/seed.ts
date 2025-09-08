import { Role } from '@/app/(dashboard)/_types/nav';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'super@admin.com';
  const adminPassword = process.env.ADMIN_PASWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_PASSWORD env var is required for seeding');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await auth.api.createUser({
      body: {
        name: 'Admin', // required
        email: adminEmail, // required
        password: adminPassword, // required
        role: Role.ADMIN,
      },
    });

    console.log(`Created admin user: ${admin.user.name} ${admin.user.email}`);
  } else {
    console.log(`Admin user already exists: ${existingAdmin.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
