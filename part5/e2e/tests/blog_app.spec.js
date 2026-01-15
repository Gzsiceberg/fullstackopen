const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('root')
    await page.getByLabel('password').fill('sekret')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })
})