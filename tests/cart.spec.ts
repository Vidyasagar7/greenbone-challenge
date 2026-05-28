import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

/**
 * TC-03 – Add product to cart updates cart badge count
 *
 * Priority 3: Adding to cart is the most common user action and the
 * prerequisite for any purchase. A silent failure here directly affects conversion.
 */
test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // Log in before each test so every cart test starts from a clean inventory page
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('TC-03 adding a product increments the cart badge count to 1', async () => {
    // No badge visible before any item is added
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addItemToCart('sauce-labs-backpack');

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adding multiple products reflects the correct total count in the badge', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');

    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('added item appears in the cart with the correct name', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();

    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
  });

  test('removing an item from the inventory page decrements the cart badge count', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });
});
