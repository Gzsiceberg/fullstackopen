import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { showNotification } from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog
} from './reducers/blogsReducer'

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
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        if (user && user.token) {
          setUser(user)
          blogService.setToken(user.token)
        }
      } catch {
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(showNotification(`Welcome ${user.name}!`, 'success'))
    } catch {
      console.log('Wrong credentials')
      dispatch(showNotification('Wrong username or password', 'error'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
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

  const handleLike = async (blog) => {
    try {
      await dispatch(likeBlog(blog))
    } catch (exception) {
      console.log('Error updating blog:', exception)
      dispatch(showNotification('Failed to update blog', 'error'))
    }
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) {
      return
    }

    try {
      await dispatch(deleteBlog(blog.id))
      dispatch(showNotification(`Blog "${blog.title}" removed`, 'success'))
    } catch (exception) {
      console.log('Error deleting blog:', exception)
      if (exception.response?.status === 401) {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        setUser(null)
        dispatch(
          showNotification('Session expired. Please login again', 'error')
        )
      } else {
        dispatch(showNotification('Failed to delete blog', 'error'))
      }
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

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
        <>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2>blogs</h2>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
