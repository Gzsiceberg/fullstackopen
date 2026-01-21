import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  test('url and likes are shown when the view button is clicked', async () => {
    const { container } = render(
      <Blog
        blog={blog}
        handleLike={() => { }}
        handleDelete={() => { }}
        currentUser={currentUser}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Check that URL and likes are now visible
    const urlElement = container.querySelector('.blog-url')
    const likesElement = container.querySelector('.blog-likes')

    expect(urlElement).toBeVisible()
    expect(urlElement).toHaveTextContent('https://testurl.com')
    expect(likesElement).toBeVisible()
    expect(likesElement).toHaveTextContent('likes 5')
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLike={mockHandler}
        handleDelete={() => { }}
        currentUser={currentUser}
      />
    )

    const user = userEvent.setup()

    // First, click the view button to reveal the like button
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Then click the like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Check that the event handler was called twice
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
