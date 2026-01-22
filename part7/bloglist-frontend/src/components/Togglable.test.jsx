import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    const button = screen.getByRole('button', { name: /\+ show/ })
    expect(button).toBeInTheDocument()
  })

  test('at start the children are not displayed', () => {
    const element = screen.queryByText('togglable content')
    expect(element).not.toBeInTheDocument()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /\+ show/ })
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeInTheDocument()
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /\+ show/ })
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(closeButton)

    expect(screen.queryByText('togglable content')).not.toBeInTheDocument()
  })
})

describe('<Togglable /> useImperativeHandle', () => {
  test('toggleVisibility method can be called via ref', async () => {
    const user = userEvent.setup()

    const TestComponent = () => {
      const togglableRef = useRef()

      return (
        <div>
          <Togglable buttonLabel="show..." ref={togglableRef}>
            <div>togglable content</div>
          </Togglable>
          <button onClick={() => togglableRef.current.toggleVisibility()}>
            toggle from parent
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    expect(screen.queryByText('togglable content')).not.toBeInTheDocument()

    const parentButton = screen.getByText('toggle from parent')
    await user.click(parentButton)

    const element = screen.getByText('togglable content')
    expect(element).toBeInTheDocument()
  })

  test('toggleVisibility method toggles visibility multiple times', async () => {
    const user = userEvent.setup()

    const TestComponent = () => {
      const togglableRef = useRef()

      return (
        <div>
          <Togglable buttonLabel="show..." ref={togglableRef}>
            <div>togglable content</div>
          </Togglable>
          <button onClick={() => togglableRef.current.toggleVisibility()}>
            toggle from parent
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    const parentButton = screen.getByText('toggle from parent')

    // Initially hidden
    expect(screen.queryByText('togglable content')).not.toBeInTheDocument()

    // Toggle to visible
    await user.click(parentButton)
    expect(screen.getByText('togglable content')).toBeInTheDocument()

    // Toggle back to hidden
    await user.click(parentButton)
    expect(screen.queryByText('togglable content')).not.toBeInTheDocument()

    // Toggle to visible again
    await user.click(parentButton)
    expect(screen.getByText('togglable content')).toBeInTheDocument()
  })

  test('ref method works after user interaction', async () => {
    const user = userEvent.setup()

    const TestComponent = () => {
      const togglableRef = useRef()

      return (
        <div>
          <Togglable buttonLabel="show..." ref={togglableRef}>
            <div>togglable content</div>
          </Togglable>
          <button onClick={() => togglableRef.current.toggleVisibility()}>
            toggle from parent
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    const showButton = screen.getByRole('button', { name: /\+ show/ })
    const parentButton = screen.getByText('toggle from parent')

    // User clicks to show content
    await user.click(showButton)
    expect(screen.getByText('togglable content')).toBeInTheDocument()

    // Parent uses ref to hide content
    await user.click(parentButton)
    expect(screen.queryByText('togglable content')).not.toBeInTheDocument()

    // Parent uses ref to show content again
    await user.click(parentButton)
    expect(screen.getByText('togglable content')).toBeInTheDocument()
  })
})