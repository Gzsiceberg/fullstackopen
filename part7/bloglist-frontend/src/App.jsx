import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import Togglable from './components/Togglable'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogsReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

const LoginForm = ({
  username,
  password,
  handleLogin,
  setUsername,
  setPassword
}) => {
  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const loggedUser = await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
      dispatch(showNotification(`Welcome ${loggedUser.name}!`, 'success'))
    } catch {
      console.log('Wrong credentials')
      dispatch(showNotification('Wrong username or password', 'error'))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(showNotification('Logged out successfully', 'success'))
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await dispatch(createBlog(blogObject))
      blogFormRef.current.toggleVisibility()
      dispatch(
        showNotification(
          `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
          'success'
        )
      )
    } catch (exception) {
      console.log('Error creating blog:', exception)
      dispatch(showNotification('Failed to create blog', 'error'))
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const Home = () => (
    <>
      {user && (
        <>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2>blogs</h2>
          {sortedBlogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </>
  )

  return (
    <div>
      <Notification />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}

      {user && (
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
