import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LoginForm = ({
  username,
  password,
  handleLogin,
  setUsername,
  setPassword
}) => {
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </CardContent>
    </Card>
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
        <div className="space-y-4">
          <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2 className="text-xl font-semibold">Blogs</h2>
          <div className="space-y-2">
            {sortedBlogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <nav className="border-b bg-card">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-lg font-bold">Blog App</Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground">Blogs</Link>
              <Link to="/users" className="text-muted-foreground hover:text-foreground">Users</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.name} logged in</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
