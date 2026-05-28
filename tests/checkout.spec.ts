import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage, CustomerInfo } from '../pages/CheckoutPage';

const TEST_CUSTOMER: CustomerInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Log in and navigate to inventory before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('TC-02 user can complete the full purchase flow and receives order confirmation', async ({
    page,
  }) => {
    // Step 1: Add a product to the cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    // Step 2: Navigate to cart and verify the item is present
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain('Sauce Labs Backpack');

    // Step 3: Proceed to checkout step 1
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 4: Fill in personal information and continue
    await checkoutPage.fillPersonalInfo(TEST_CUSTOMER);
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 5: Verify the order overview contains the expected item
    const summaryItemCount = await checkoutPage.summaryItems.count();
    expect(summaryItemCount).toBe(1);

    // Step 6: Finish the order
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 7: Verify the confirmation message
    const confirmationHeader = await checkoutPage.getConfirmationHeader();
    expect(confirmationHeader).toBe('Thank you for your order!');
  });

  test('checkout form shows error when first name is missing', async ({
    page,
  }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Submit form without filling in any fields
    await checkoutPage.continue();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('checkout form shows error when last name is missing', async ({
    page,
  }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillPersonalInfo({
      firstName: 'Test',
      lastName: '',
      postalCode: '12345',
    });
    await checkoutPage.continue();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('checkout form shows error when postal code is missing', async ({
    page,
  }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillPersonalInfo({
      firstName: 'Test',
      lastName: 'User',
      postalCode: '',
    });
    await checkoutPage.continue();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });
});
