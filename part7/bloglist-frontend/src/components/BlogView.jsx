import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/userReducer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const user = useSelector((state) => state.user)

  if (!blog) {
    return <div className="text-muted-foreground">Blog not found</div>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">by {blog.author}</p>
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline block"
          >
            {blog.url}
          </a>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{blog.likes} likes</Badge>
            <Button size="sm" onClick={handleLike}>Like</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Added by {blog.user ? blog.user.name : 'unknown'}
          </p>
          {isOwner && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Remove
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Comments
            {blog.comments && blog.comments.length > 0 && (
              <Badge variant="secondary">{blog.comments.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleComment} className="flex gap-3">
            <Input
              type="text"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button type="submit" disabled={!comment.trim()}>
              Add Comment
            </Button>
          </form>

          {blog.comments && blog.comments.length > 0 ? (
            <ul className="space-y-2">
              {blog.comments.map((c, index) => (
                <li key={index} className="p-3 bg-muted rounded-md">
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogView
