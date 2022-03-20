/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../../pages/api/departments/index.js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(() => prisma.$disconnect());

describe('GET /api/dashboards', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
      },
    });
  });
});

describe('POST /api/dashboards', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST' });
        expect(res.status).toBe(401);
      },
    });
  });
});

describe('Invalid HTTP methods for /api/dashboards', () => {
  ['PUT'].forEach(methodType => {
    it(`doesn't allow ${methodType} requests`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: methodType });
          expect(res.status).toBe(405);
        },
      });
    });
  });
});
