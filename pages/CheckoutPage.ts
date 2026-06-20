import { Page, Locator } from '@playwright/test';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  readonly page: Page;

  // Step 1 – personal info form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step 2 – overview
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly summaryItems: Locator;

  // Complete
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    //this.firstNameInput = page.getByTestId('firstName');
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.finishButton = page.getByTestId('finish');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.summaryItems = page.getByTestId('inventory-item');

    this.confirmationHeader = page.getByTestId('complete-header');
  }

  /** Fills in the personal information form on checkout step 1 */
  async fillPersonalInfo(info: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  /** Submits the personal info form to proceed to the order overview */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /** Finalises the order on the overview page */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Returns the error message text from step 1, or empty string if none */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Returns the confirmation heading text from the complete page */
  async getConfirmationHeader(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }

  /** Returns the item subtotal text (e.g. "Item total: $29.99") */
  async getItemTotal(): Promise<string> {
    return (await this.itemTotal.textContent()) ?? '';
  }
}
