import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Enter blog title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Enter blog author"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder="Enter blog URL"
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default BlogForm
