const { test, describe, expect, beforeEach } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

describe('blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'root', 'sekret')
    await expect(page.getByText('Superuser logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Wrong username or password')).toBeVisible()
  })

})