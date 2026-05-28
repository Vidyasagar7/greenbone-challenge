import { Page, Locator } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  /** Returns the current cart item count shown in the badge, or 0 if badge is not visible */
  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /**
   * Adds an item to the cart by its product name.
   * Constructs the data-test selector dynamically from the product name.
   */
  async addItemToCart(productName: string): Promise<void> {
    const testId = `add-to-cart-${this.slugify(productName)}`;
    await this.page.getByTestId(testId).click();
  }

  /**
   * Removes an item from the cart while still on the inventory page.
   */
  async removeItemFromCart(productName: string): Promise<void> {
    const testId = `remove-${this.slugify(productName)}`;
    await this.page.getByTestId(testId).click();
  }

  /** Navigates to the cart page */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Selects a sort option from the dropdown */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** Returns all visible item prices as numbers, in DOM order */
  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((t) => parseFloat(t.replace('$', '')));
  }

  /** Converts a product display name to the kebab-case format used in data-test attributes */
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
