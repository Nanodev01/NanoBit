const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nanobit.me').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ERROR CRÍTICO: Debes definir ADMIN_PASSWORD en tus variables de entorno para crear el administrador de forma segura.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Actualiza la contraseña si el usuario ya existe
    },
    create: {
      email: adminEmail,
      name: 'Nanodev',
      password: hashedPassword,
    },
  });

  const existingProfile = await prisma.profile.findFirst();

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        title: 'Software Programmer & Cybersecurity',
        description: 'Construyendo soluciones escalables, eficientes y seguras. Me enfoco en la calidad del código y la resiliencia de la infraestructura.',
      }
    });
  } else {
    await prisma.profile.create({
      data: {
        title: 'Software Programmer & Cybersecurity',
        description: 'Construyendo soluciones escalables, eficientes y seguras. Me enfoco en la calidad del código y la resiliencia de la infraestructura.',
      }
    });
  }

  console.log(`Seed exitoso. Usuario Admin configurado: ${adminEmail} | Password: [PROTEGIDO]`);
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
