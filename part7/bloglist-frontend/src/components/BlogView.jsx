import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/userReducer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
            {blog.comments && blog.comments.length > 0 && (
              <Badge variant="secondary">{blog.comments.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <div className="space-y-3">
              {blog.comments.map((c, index) => (
                <Card key={index} className="py-3">
                  <CardContent className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {String.fromCharCode(65 + (index % 26))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{c}</p>
                      <p className="text-xs text-muted-foreground">
                        Comment #{index + 1}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogView
