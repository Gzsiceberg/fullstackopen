const { test, describe, expect, beforeEach } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.locator('.blog')).toContainText(title)
}

describe('blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }
    await request.post('/api/users', { data: newUser })
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

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog Title', 'Test Author', 'http://testurl.com')
    })

    test('a blog can be liked', async ({ page }) => {
      test.setTimeout(10000) // Increase timeout for this test
      await createBlog(page, 'Blog to Like', 'Like Author', 'http://likeurl.com')

      // Find the specific blog we just created and click view
      const blogElement = page.locator('.blog').filter({ hasText: 'Blog to Like' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      // Verify initial likes count is 0 within this specific blog
      await expect(blogElement.locator('.blog-likes')).toContainText('likes 0')

      // Click like button within this specific blog
      await blogElement.getByRole('button', { name: 'like' }).click()

      // Wait for the like count to update - re-query the blog element since it might have moved
      await expect(blogElement.locator('.blog-likes')).toContainText('likes 1')
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      test.setTimeout(10000) // Increase timeout for this test
      await createBlog(page, 'Blog to Delete', 'Delete Author', 'http://deleteurl.com')

      // Find the blog and click view to see the remove button
      const blogElement = page.locator('.blog').filter({ hasText: 'Blog to Delete' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      await expect(blogElement.locator('.blog-remove')).toBeVisible()

      // Set up dialog handler to accept the confirmation
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Blog to Delete')
        await dialog.accept()
      })

      // Click the remove button
      await page.locator('.blog-remove').click()

      // Verify the blog is no longer in the list
      await expect(page.locator('.blog').filter({ hasText: 'Blog to Delete' })).not.toBeVisible()
    })
  })

})