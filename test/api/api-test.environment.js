/**
 * Authors: Shubham Jain, Mateusz Zielinski, Matthew Schulz
 * Contributers: Sarvesh Rajdev
 */
const fs = require('fs');

const NodeEnvironment = require('jest-environment-node');
const { Client: PgClient } = require('pg');

const prisma = require('../../lib/prisma');
const { standards, likertScaleQuestions } = require('../../seedData');

const getClient = async () => {
  const client = new PgClient({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  return client;
};

class ApiTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    const client = await getClient();
    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    const schema = fs.readFileSync('schema.sql', 'utf8');
    const schemaLines = schema.split(';');
    for (let i = 0; i < schemaLines.length; i++) {
      const line = schemaLines[i].trim() + ';';
      if (line.startsWith('--')) continue;
      await client.query(line);
    }

    await Promise.all([
      prisma.users.create({
        data: {
          id: 'clinician',
          user_type: 'clinician',
        },
      }),
      prisma.users.create({
        data: {
          id: 'department_manager',
          user_type: 'department_manager',
        },
      }),
      prisma.users.create({
        data: {
          id: 'hospital',
          user_type: 'hospital',
        },
      }),
      prisma.users.create({
        data: {
          id: 'health_board',
          user_type: 'health_board',
        },
      }),
      prisma.health_boards.create({
        data: {
          id: 1,
          name: 'Test Health Board',
          hospitals: {
            create: [
              {
                id: 1,
                name: 'Test Hospital',
                departments: {
                  create: [
                    { id: 1, name: 'Test Department' },
                    { id: 2, name: 'Test Department 2' },
                  ],
                },
              },
              {
                id: 2,
                name: 'Test Hospital 2',
                departments: {
                  create: [{ id: 3, name: 'Test Department 3' }],
                },
              },
            ],
          },
        },
      }),
      prisma.health_boards.create({
        data: {
          id: 2,
          name: 'Test Health Board 2',
          hospitals: {
            create: [
              {
                id: 3,
                name: 'Test Hospital 3',
                departments: {
                  create: [
                    { id: 4, name: 'Test Department 4' },
                    { id: 5, name: 'Test Department 5' },
                  ],
                },
              },
              {
                id: 4,
                name: 'Test Hospital 4',
                departments: {
                  create: [{ id: 6, name: 'Test Department 6' }],
                },
              },
            ],
          },
        },
      }),
      ...standards.map((standard, i) =>
        prisma.standards.create({ data: { name: standard, id: i + 1 } })
      ),
    ]);

    var question_data = [];

    likertScaleQuestions.map(question =>
      question_data.push({
        default_url: question.url,
        standards: { connect: { id: question.standardId } },
        type: 'likert_scale',
        body: question.question,
      })
    );

    const dashboard = {
      data: {
        users: { connect: { id: 'clinician' } },
        name: 'Care Quality Dashboard',
        departments: { connect: { id: 1 } },
        questions: { create: question_data },
      },
    };

    await Promise.all([prisma.dashboard.create(dashboard)]); // Start auto-incrementing at 1000 (large number) so the hard-coded values
    // in the tests don't cause conflicts
    await client.query('ALTER SEQUENCE departments_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE hospitals_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE health_boards_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE questions_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE responses_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE standards_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE words_id_seq RESTART 1000;');
    await client.end();
  }

  async teardown() {
    await prisma.$disconnect();
    const client = await getClient();
    await client.query(`DROP SCHEMA public CASCADE;`);
    await client.end();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = ApiTestEnvironment;
