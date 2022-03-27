const { PrismaClient } = require('@prisma/client');
const { standards } = require('../seedData');

const prisma = new PrismaClient();

const seedStandards = async () => {
  await Promise.all(
    standards.map((standard, i) =>
      prisma.standards.create({ data: { name: standard, id: i + 1 } })
    )
  );
};

const seedEntities = async () => {
  await prisma.health_boards.create({
    data: {
      name: 'Aneurin Bevan',
      hospitals: {
        create: [
          {
            name: 'The Grange University Hospital',
            departments: {
              create: [
                {
                  name: 'Band 5 Physiotherapist',
                  department_join_codes: { create: { code: 'DRC-HtZ-xrt' } },
                  clinician_join_codes: { create: { code: 'de6-Ndv-V0z' } },
                },
                {
                  name: 'Rotational Band 6 Physiotherapist',
                  department_join_codes: { create: { code: '0ON-c5n-0tj' } },
                  clinician_join_codes: { create: { code: 'xVr-kKT-1Gc' } },
                },
                {
                  name: 'Band 6 MSK pod/static Physiotherapist',
                  department_join_codes: { create: { code: 'RMw-sWA-pnd' } },
                  clinician_join_codes: { create: { code: 'JPH-BRM-fQV' } },
                },
                {
                  name: 'Band 7 Physiotherapist',
                  department_join_codes: { create: { code: 'U3a-D9b-ai0' } },
                  clinician_join_codes: { create: { code: 'Dvl-9xl-Dvp' } },
                },
                {
                  name: 'Band 8 Physiotherapist',
                  department_join_codes: { create: { code: 'd75-ira-tX8' } },
                  clinician_join_codes: { create: { code: 'sEw-zjp-ouJ' } },
                },
              ],
            },
          },
          {
            name: 'Royal Gwent Hospital',
            departments: {
              create: [
                {
                  name: 'Band 5 Physiotherapist',
                  department_join_codes: { create: { code: 'ZQ5-gG7-ExH' } },
                  clinician_join_codes: { create: { code: 'U7N-vvs-obz' } },
                },
              ],
            },
          },
        ],
      },
    },
  });
};

const seedData = async () => {
  await seedStandards();
  await seedEntities();
};

seedData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
