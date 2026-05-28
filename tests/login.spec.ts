import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-01 standard_user logs in with correct credentials and lands on inventory page', async ({
    page,
  }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify the user is redirected to the inventory page
    await expect(page).toHaveURL(/inventory\.html/);

    // Verify the page title and product list are present
    await expect(page.getByTestId('inventory-container')).toBeVisible();
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('login page renders all required elements', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('locked_out_user sees a descriptive error message', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('locked out');
  });

  test('login with wrong password shows error message', async () => {
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });
});
