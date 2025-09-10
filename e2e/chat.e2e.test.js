import { test, expect } from "@playwright/test";

test.describe("Chat Application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chat application
    await page.goto("http://localhost:3000");
  });

  test("should load the chat page", async ({ page }) => {
    // Check if the page loads successfully
    await expect(page).toHaveTitle(/Chat Anonyme/);

    // Check if the page contains expected content
    const content = await page.textContent("body");
    expect(content).toContain("Chat Anonyme");
  });

  test("should have working API endpoint", async ({ page }) => {
    // Test the API endpoint directly
    const response = await page.request.get(
      "http://localhost:3000/api/messages"
    );
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should handle API with limit parameter", async ({ page }) => {
    // Test API with limit parameter
    const response = await page.request.get(
      "http://localhost:3000/api/messages?limit=10"
    );
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should handle API with invalid limit parameter", async ({ page }) => {
    // Test API with invalid limit parameter
    const response = await page.request.get(
      "http://localhost:3000/api/messages?limit=invalid"
    );
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should handle API with large limit parameter", async ({ page }) => {
    // Test API with limit parameter that should be capped
    const response = await page.request.get(
      "http://localhost:3000/api/messages?limit=500"
    );
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should serve static files", async ({ page }) => {
    // Test if static files are served correctly
    const response = await page.request.get("http://localhost:3000/app.js");
    expect(response.status()).toBe(200);
  });

  test("should serve CSS files", async ({ page }) => {
    // Test if CSS files are served correctly
    const response = await page.request.get("http://localhost:3000/style.css");
    expect(response.status()).toBe(200);
  });
});
