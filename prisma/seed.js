import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'homurasupportstaff', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'support@homura' },
    update: {},
    create: {
      email: 'support@homura',
      password: hashedPassword,
    },
  });

  console.log('✓ Admin created:', admin.email);

  // Create sample data
  const sampleCommunication = await prisma.communication.create({
    data: {
      title: 'Benvenuti in Homura! 🎉',
      content: 'Benvenuti nella community Discord di Homura! Siete parte di una comunità fantastica. Leggete le regole e divertitevi!',
      type: 'announcement',
      isActive: true,
      priority: 1,
    },
  });

  console.log('✓ Sample communication created');

  console.log('Database seeding completed! ✓');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
