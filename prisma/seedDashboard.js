const { PrismaClient } = require('@prisma/client');
const {
  standards,
  likertScaleQuestions,
  wordsQuestions,
} = require('../seedData');
const prisma = new PrismaClient();

const getRandomScore = () => Math.floor(Math.random() * 5);

const seedDashboards = async userId => {
  standards_data = [];
  question_data = [];

  likertScaleQuestions.map(question =>
    question_data.push({
      default_url: question.url,
      standards: { connect: { id: question.standardId } },
      type: 'likert_scale',
      body: question.question,
    })
  );

  // TODO: Create seed data for words
  responses = [
    {
      users: { connect: { id: userId } },
      departments: { connect: { id: 1 } },
      timestamp: new Date('2020-12-01 13:00:00'),
      is_mentoring_session: true,
      scores: {
        create: [
          { score: getRandomScore(), standards: { connect: { id: 1 } } },
          { score: getRandomScore(), standards: { connect: { id: 2 } } },
          { score: getRandomScore(), standards: { connect: { id: 3 } } },
          { score: getRandomScore(), standards: { connect: { id: 4 } } },
          { score: getRandomScore(), standards: { connect: { id: 5 } } },
          { score: getRandomScore(), standards: { connect: { id: 6 } } },
          { score: getRandomScore(), standards: { connect: { id: 7 } } },
        ],
      },
    },
    {
      users: { connect: { id: userId } },
      departments: { connect: { id: 1 } },
      timestamp: new Date('2020-12-07 13:00:00'),
      is_mentoring_session: false,
      scores: {
        create: [
          { score: getRandomScore(), standards: { connect: { id: 1 } } },
          { score: getRandomScore(), standards: { connect: { id: 2 } } },
          { score: getRandomScore(), standards: { connect: { id: 3 } } },
          { score: getRandomScore(), standards: { connect: { id: 4 } } },
          { score: getRandomScore(), standards: { connect: { id: 5 } } },
          { score: getRandomScore(), standards: { connect: { id: 6 } } },
          { score: getRandomScore(), standards: { connect: { id: 7 } } },
        ],
      },
    },
    {
      users: { connect: { id: userId } },
      departments: { connect: { id: 1 } },
      timestamp: new Date('2020-12-14 13:00:00'),
      is_mentoring_session: true,
      scores: {
        create: [
          { score: getRandomScore(), standards: { connect: { id: 1 } } },
          { score: getRandomScore(), standards: { connect: { id: 2 } } },
          { score: getRandomScore(), standards: { connect: { id: 3 } } },
          { score: getRandomScore(), standards: { connect: { id: 4 } } },
          { score: getRandomScore(), standards: { connect: { id: 5 } } },
          { score: getRandomScore(), standards: { connect: { id: 6 } } },
          { score: getRandomScore(), standards: { connect: { id: 7 } } },
        ],
      },
    },
    {
      users: { connect: { id: userId } },
      departments: { connect: { id: 1 } },
      timestamp: new Date('2021-01-01 10:00:00'),
      is_mentoring_session: false,
      scores: {
        create: [
          { score: getRandomScore(), standards: { connect: { id: 1 } } },
          { score: getRandomScore(), standards: { connect: { id: 2 } } },
          { score: getRandomScore(), standards: { connect: { id: 3 } } },
          { score: getRandomScore(), standards: { connect: { id: 4 } } },
          { score: getRandomScore(), standards: { connect: { id: 5 } } },
          { score: getRandomScore(), standards: { connect: { id: 6 } } },
          { score: getRandomScore(), standards: { connect: { id: 7 } } },
        ],
      },
    },
  ];

  dashboard = {
    data: {
      users: { connect: { id: userId } },
      name: 'Care Quality Dashboard',
      questions: { create: question_data },
      responses: { create: responses },
    },
  };

  /**
   * Uncomment this for all data, eg questions and responses
   */

  // await Promise.all([prisma.dashboard.create(dashboard)]);

  /**
   * Uncomment this for fake date, just names
   */

  // await Promise.all([
  //   prisma.dashboard.create({
  //     data: {
  //       users: { connect: { id: userId } },
  //       name: 'Test1',
  //     },
  //   }),
  //   prisma.dashboard.create({
  //     data: {
  //       users: { connect: { id: userId } },
  //       name: 'Test2',
  //     },
  //   }),
  // ]);
};

/**
 * IMPORTANT:
 * Dashboard does not need to store standards
 * Standards can be stored seperately and questions may share standards
 * Questions should be linked to dashboard
 */
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
