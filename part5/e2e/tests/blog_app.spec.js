const { test, describe, expect } = require('@playwright/test')

describe('blog app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await expect(page.getByLabel('username')).toBeVisible()
  })
})