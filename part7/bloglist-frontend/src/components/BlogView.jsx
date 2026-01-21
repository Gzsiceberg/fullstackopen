import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/userReducer'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const user = useSelector((state) => state.user)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isOwner = user && blog.user && blog.user.username === user.username

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog))
    } catch (exception) {
      console.log('Error updating blog:', exception)
      dispatch(showNotification('Failed to update blog', 'error'))
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) {
      return
    }

    try {
      await dispatch(deleteBlog(blog.id))
      dispatch(showNotification(`Blog "${blog.title}" removed`, 'success'))
      navigate('/')
    } catch (exception) {
      console.log('Error deleting blog:', exception)
      if (exception.response?.status === 401) {
        dispatch(logoutUser())
        dispatch(
          showNotification('Session expired. Please login again', 'error')
        )
      } else {
        dispatch(showNotification('Failed to delete blog', 'error'))
      }
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()
    try {
      await dispatch(addComment(blog.id, comment))
      setComment('')
    } catch (exception) {
      console.log('Error adding comment:', exception)
      dispatch(showNotification('Failed to add comment', 'error'))
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isOwner && <button onClick={handleDelete}>remove</button>}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments &&
          blog.comments.map((c, index) => <li key={index}>{c}</li>)}
      </ul>
    </div>
  )
}

export default BlogView
