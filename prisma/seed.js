const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('nanobit123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@nanobit.me' },
    update: {},
    create: {
      email: 'admin@nanobit.me',
      name: 'Nanodev',
      password: hashedPassword,
    },
  });

  const profile = await prisma.profile.create({
    data: {
      title: 'Software Engineer & Cybersecurity',
      description: 'Construyendo soluciones escalables, eficientes y seguras. Me enfoco en la calidad del código y la resiliencia de la infraestructura.',
    }
  });

  console.log('Seed exitoso. Usuario Admin: admin@nanobit.me | Password: nanobit123');
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
