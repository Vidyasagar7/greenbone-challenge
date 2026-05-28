import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  /** Returns the names of all items currently in the cart */
  async getCartItemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  /** Returns the count of items currently shown in the cart */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Proceeds to the checkout flow */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /** Returns to the inventory page without clearing the cart */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
