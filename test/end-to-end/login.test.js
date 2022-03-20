import prisma from '../../lib/prisma';
import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Logging in', () => {
  beforeEach(async () => await page.goto(process.env.BASE_URL));
  afterEach(async () => await signOutToHomepage());
  afterAll(async () => await prisma.$disconnect());

  it('Logs in as department', async () => {
    await logInAs({
      username: 'department@example.com',
      password: 'department',
    });
    await expect(page).toMatchElement('a', { text: 'view' });
    await expect(page).toMatchElement('a', { text: 'create' });
    await expect(page).toMatchElement('a', { text: 'join' });
    await expect(page).toMatchElement('a', { text: 'Your account' });
  });
});
