import { Page, Locator } from '@playwright/test';

/**
 * LoginPage encapsulates all interactions with the Sauce Labs login screen.
 * Uses stable data-test attributes as selectors throughout.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  /** Navigate to the login page (base URL is set in playwright.config.ts) */
  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  /** Fill credentials and submit the login form */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Returns the text content of the error banner, or empty string if not present */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** True when the error message banner is visible on screen */
  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
