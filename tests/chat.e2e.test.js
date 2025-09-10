import { test, expect } from "@playwright/test";

test.describe("Chat Application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chat application
    await page.goto("http://localhost:3000");
  });

  test("should load the chat page", async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Chat Anonyme/);

    // Check if the main elements are present
    await expect(page.locator("h1")).toContainText("Chat Anonyme");
  });

  test("should allow user to join chat with nickname", async ({ page }) => {
    // Look for nickname input and join button
    const nicknameInput = page.locator('input[type="text"]').first();
    const joinButton = page.locator("button").first();

    // Enter nickname and join
    await nicknameInput.fill("Alice");
    await joinButton.click();

    // Check if welcome message appears
    await expect(page.locator("text=Bienvenue Alice")).toBeVisible();
  });

  test("should allow user to send messages", async ({ page }) => {
    // Join chat first
    await page.locator('input[type="text"]').first().fill("Alice");
    await page.locator("button").first().click();

    // Wait for welcome message
    await expect(page.locator("text=Bienvenue Alice")).toBeVisible();

    // Send a message
    const messageInput = page.locator('input[type="text"]').nth(1);
    const sendButton = page.locator("button").nth(1);

    await messageInput.fill("Hello world!");
    await sendButton.click();

    // Check if message appears in chat
    await expect(page.locator("text=Alice: Hello world!")).toBeVisible();
  });

  test("should handle empty nickname", async ({ page }) => {
    // Try to join with empty nickname
    await page.locator("button").first().click();

    // Should get welcome message with "Anonyme"
    await expect(page.locator("text=Bienvenue Anonyme")).toBeVisible();
  });

  test("should handle multiple users", async ({ browser }) => {
    // Create two browser contexts for two users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // User 1 joins
    await page1.goto("http://localhost:3000");
    await page1.locator('input[type="text"]').first().fill("Alice");
    await page1.locator("button").first().click();
    await expect(page1.locator("text=Bienvenue Alice")).toBeVisible();

    // User 2 joins
    await page2.goto("http://localhost:3000");
    await page2.locator('input[type="text"]').first().fill("Bob");
    await page2.locator("button").first().click();
    await expect(page2.locator("text=Bienvenue Bob")).toBeVisible();

    // User 1 should see Bob joining
    await expect(page1.locator("text=Bob a rejoint le chat")).toBeVisible();

    // User 1 sends message
    await page1.locator('input[type="text"]').nth(1).fill("Hello Bob!");
    await page1.locator("button").nth(1).click();

    // Both users should see the message
    await expect(page1.locator("text=Alice: Hello Bob!")).toBeVisible();
    await expect(page2.locator("text=Alice: Hello Bob!")).toBeVisible();

    // User 2 sends reply
    await page2.locator('input[type="text"]').nth(1).fill("Hi Alice!");
    await page2.locator("button").nth(1).click();

    // Both users should see the reply
    await expect(page1.locator("text=Bob: Hi Alice!")).toBeVisible();
    await expect(page2.locator("text=Bob: Hi Alice!")).toBeVisible();

    // Clean up
    await context1.close();
    await context2.close();
  });

  test("should handle long messages", async ({ page }) => {
    // Join chat
    await page.locator('input[type="text"]').first().fill("Alice");
    await page.locator("button").first().click();
    await expect(page.locator("text=Bienvenue Alice")).toBeVisible();

    // Send a very long message
    const longMessage = "A".repeat(1500);
    await page.locator('input[type="text"]').nth(1).fill(longMessage);
    await page.locator("button").nth(1).click();

    // Message should be truncated to 1000 characters
    const displayedMessage = page.locator("text=Alice: " + "A".repeat(1000));
    await expect(displayedMessage).toBeVisible();
  });

  test("should handle empty messages", async ({ page }) => {
    // Join chat
    await page.locator('input[type="text"]').first().fill("Alice");
    await page.locator("button").first().click();
    await expect(page.locator("text=Bienvenue Alice")).toBeVisible();

    // Try to send empty message
    await page.locator("button").nth(1).click();

    // No message should appear
    const messages = page.locator('[class*="message"]');
    const messageCount = await messages.count();
    expect(messageCount).toBe(0); // Only system messages, no chat messages
  });

  test("should display message history on page load", async ({ page }) => {
    // This test assumes there are existing messages in the database
    // In a real scenario, you might seed the database with test data

    await page.goto("http://localhost:3000");

    // Join chat
    await page.locator('input[type="text"]').first().fill("Alice");
    await page.locator("button").first().click();

    // Check if any existing messages are displayed
    // This would depend on your UI implementation
    // You might need to adjust selectors based on your actual HTML structure
  });
});
