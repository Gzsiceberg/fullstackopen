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
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeVisible()
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
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

    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()

    const parentButton = screen.getByText('toggle from parent')
    await user.click(parentButton)

    expect(element).toBeVisible()
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

    const element = screen.getByText('togglable content')
    const parentButton = screen.getByText('toggle from parent')

    // Initially hidden
    expect(element).not.toBeVisible()

    // Toggle to visible
    await user.click(parentButton)
    expect(element).toBeVisible()

    // Toggle back to hidden
    await user.click(parentButton)
    expect(element).not.toBeVisible()

    // Toggle to visible again
    await user.click(parentButton)
    expect(element).toBeVisible()
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

    const element = screen.getByText('togglable content')
    const showButton = screen.getByText('show...')
    const parentButton = screen.getByText('toggle from parent')

    // User clicks to show content
    await user.click(showButton)
    expect(element).toBeVisible()

    // Parent uses ref to hide content
    await user.click(parentButton)
    expect(element).not.toBeVisible()

    // Parent uses ref to show content again
    await user.click(parentButton)
    expect(element).toBeVisible()
  })
})