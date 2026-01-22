import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
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

  test('renders blog title and author', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    const linkElement = screen.getByText('Test Blog Title - Test Author')
    expect(linkElement).toBeInTheDocument()
  })

  test('renders as a link to the blog detail page', async () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    const linkElement = screen.getByText('Test Blog Title - Test Author')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', `/blogs/${blog.id}`)
  })
})
