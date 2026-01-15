import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const currentUser = {
    username: 'testuser',
    name: 'Test User'
  }

  test('renders title and author, but not url or likes by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        handleLike={() => { }}
        handleDelete={() => { }}
        currentUser={currentUser}
      />
    )

    // Check that title and author are rendered
    const titleAuthorElement = container.querySelector('.blog-title-author')
    expect(titleAuthorElement).toHaveTextContent('Test Blog Title')
    expect(titleAuthorElement).toHaveTextContent('Test Author')

    // Check that URL and likes are not visible by default
    const urlElement = container.querySelector('.blog-url')
    const likesElement = container.querySelector('.blog-likes')

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
  })
})
