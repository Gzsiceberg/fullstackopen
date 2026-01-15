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
  await expect(page.getByText(`${title} ${author}`)).toBeVisible()
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

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {
      test.setTimeout(10000)
      
      // Create a blog as the first user (root)
      await createBlog(page, 'Root User Blog', 'Root Author', 'http://rootblog.com')

      // Create a second user
      const secondUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpass'
      }
      await request.post('/api/users', { data: secondUser })

      // Log out the first user
      await page.getByRole('button', { name: 'logout' }).click()

      // Log in as the second user
      await loginWith(page, 'testuser', 'testpass')
      await expect(page.getByText('Test User logged in')).toBeVisible()

      // Find the blog created by the first user and click view
      const blogElement = page.locator('.blog').filter({ hasText: 'Root User Blog' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      // Verify the delete button is NOT visible for the second user
      await expect(blogElement.locator('.blog-remove')).not.toBeVisible()
    })

    test('blogs are ordered by likes with most likes first', async ({ page }) => {
      test.setTimeout(20000)
      
      // Create three blogs
      await createBlog(page, 'First Blog', 'Author One', 'http://first.com')
      await createBlog(page, 'Second Blog', 'Author Two', 'http://second.com')
      await createBlog(page, 'Third Blog', 'Author Three', 'http://third.com')

      // Give the first blog 2 likes
      const firstBlog = page.locator('.blog').filter({ hasText: 'First Blog' })
      await firstBlog.getByRole('button', { name: 'view' }).click()
      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog.locator('.blog-likes')).toContainText('likes 1')
      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog.locator('.blog-likes')).toContainText('likes 2')

      // Give the second blog 5 likes
      const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog' })
      await secondBlog.getByRole('button', { name: 'view' }).click()
      for (let i = 1; i <= 5; i++) {
        await secondBlog.getByRole('button', { name: 'like' }).click()
        await expect(secondBlog.locator('.blog-likes')).toContainText(`likes ${i}`)
      }

      // Give the third blog 3 likes
      const thirdBlog = page.locator('.blog').filter({ hasText: 'Third Blog' })
      await thirdBlog.getByRole('button', { name: 'view' }).click()
      for (let i = 1; i <= 3; i++) {
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await expect(thirdBlog.locator('.blog-likes')).toContainText(`likes ${i}`)
      }

      // Get all blogs and verify they are ordered by likes (most likes first)
      const blogs = await page.locator('.blog').all()
      expect(blogs.length).toBe(3)
      
      // Extract blog content from .blog-title-author in order
      const firstBlogText = await blogs[0].locator('.blog-title-author').textContent()
      const secondBlogText = await blogs[1].locator('.blog-title-author').textContent()
      const thirdBlogText = await blogs[2].locator('.blog-title-author').textContent()

      // Verify order: Second Blog (5 likes), Third Blog (3 likes), First Blog (2 likes)
      expect(firstBlogText).toContain('Second Blog')
      expect(secondBlogText).toContain('Third Blog')
      expect(thirdBlogText).toContain('First Blog')
    })
  })

})