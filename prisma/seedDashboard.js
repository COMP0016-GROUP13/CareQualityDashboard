const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedDashboards = async userId => {
  await Promise.all([
    prisma.dashboard.create({
      data: {
        users: { connect: { id: userId } },
        name: 'Test1',
      },
    }),
    prisma.dashboard.create({
      data: {
        users: { connect: { id: userId } },
        name: 'Test2',
      },
    }),
  ]);
};

const userId = process.argv[2];

if (!userId) {
  return console.error(
    'You must run this script with the user ID for whom you want to insert data. e.g. node seedResponses.js fa0c7dea-ade1-4425-c659-4bf56eae7eb6'
  );
}

console.log('Seeding dashboards for user ' + userId);

seedDashboards(userId)
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
