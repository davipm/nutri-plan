import { Role } from '@/app/(dashboard)/_types/nav';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function main() {
  const adminEmail = 'super@admin.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await auth.api.createUser({
      body: {
        name: 'Admin', // required
        email: adminEmail, // required
        password: '1234', // required
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
