import { useState } from 'react'
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
    <div>
      <h3 className="text-lg font-semibold mb-4">Create New Blog</h3>
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
    </div>
  )
}

export default BlogForm
