import { logInAs, signOutToHomepage } from './e2e-helper';

describe('Checking each user permissions to access pages', () => {
  beforeAll(async () => await page.goto(process.env.BASE_URL));

  afterEach(async () => {
    await signOutToHomepage();
  });

  it('Logs in as clincian and cannot access manage or admin pages', async () => {
    await logInAs({
      username: 'clinician@example.com',
      password: 'clinician',
    });

    await page.goto(process.env.BASE_URL + '/manage');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });

    await page.goto(process.env.BASE_URL + '/admin');
    await expect(page).toMatchElement('p', {
      text: 'You do not have access to this page',
    });
  });
});
