import prisma from '../lib/prisma.js';

const standards = [
  'Staff and Resources',
  'Staying Healthy',
  'Individual Care',
  'Timely Care',
  'Dignified Care',
  'Effective Care',
  'Safe Care',
  'Governance, Leadership and Accountability',
];

const userTypes = [
  'Administrator',
  'Health Board',
  'Hospital',
  'Department',
  'Clinician',
];

const likertScaleQuestions = [
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    standardId: 1,
    url: 'https://example.com',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    standardId: 2,
    url: 'https://example.com',
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standardId: 3,
    url: 'https://example.com',
  },
  {
    question:
      'I have listened and responded with empathy to the patient’s concerns.',
    standardId: 4,
    url: 'https://example.com',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    standardId: 5,
    url: 'https://example.com',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    standardId: 6,
    url: 'https://example.com',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    standardId: 7,
    url: 'https://example.com',
  },
];

const wordsQuestions = [
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    standardId: 8,
    url: 'https://example.com',
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    standardId: 8,
    url: 'https://example.com',
  },
];

const seedStandards = async () => {
  await Promise.all(
    standards.map(standard =>
      prisma.standards.create({ data: { name: standard } })
    )
  );
};

const seedUserTypes = async () => {
  await Promise.all(
    userTypes.map(type =>
      prisma.user_types.create({ data: { description: type } })
    )
  );
};

const seedEntities = async () => {
  await prisma.health_boards.create({
    data: {
      health_board_name: 'Demo Health Board',
      id: 1,
      hospitals: {
        create: {
          id: 1,
          hospital_name: 'Demo Hospital',
          departments: {
            create: { department_name: 'Demo Department' },
          },
        },
      },
    },
  });

  await prisma.users.create({
    data: {
      password: 'demo',
      user_type_id: 1,
      dept_clincian_user_type: {
        create: { departments: { connect: { id: 1 } } },
      },
    },
  });
};

const seedQuestions = async () => {
  await Promise.all(
    likertScaleQuestions.map(question =>
      prisma.questions.create({
        data: {
          question_url: question.url,
          standards: { connect: { id: question.standardId } },
          question_type: 'likert_scale',
          question_body: question.question,
        },
      })
    )
  );

  await Promise.all(
    wordsQuestions.map(question =>
      prisma.questions.create({
        data: {
          question_url: question.url,
          standards: { connect: { id: question.standardId } },
          question_type: 'words',
          question_body: question.question,
        },
      })
    )
  );
};

const seedData = async () => {
  await seedStandards();
  await seedUserTypes();
  await seedEntities();
  await seedQuestions();
};

seedData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());