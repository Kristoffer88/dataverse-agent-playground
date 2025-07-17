import { test, expect } from "@playwright/test";

test("Get system users", async ({ page }) => {
    await page.goto("");
    await page.getByRole("button", { name: "Fetch System Users" }).click();
    await expect(page.getByText("System Users Count")).toBeVisible();
});
