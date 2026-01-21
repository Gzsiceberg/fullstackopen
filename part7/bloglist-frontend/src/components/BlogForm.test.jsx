import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    // Find input fields by placeholder text
    const titleInput = screen.getByPlaceholderText('enter blog title')
    const authorInput = screen.getByPlaceholderText('enter blog author')
    const urlInput = screen.getByPlaceholderText('enter blog url')
    const submitButton = screen.getByText('create')

    // Fill in the form
    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://testurl.com')

    // Submit the form
    await user.click(submitButton)

    // Check that createBlog was called once with the correct data
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://testurl.com'
    })
  })
})
