import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

const Blog = ({ blog }) => {
  return (
    <Card className="blog">
      <CardContent className="py-3">
        <Link 
          to={`/blogs/${blog.id}`} 
          className="text-primary hover:underline"
        >
          {blog.title} - {blog.author}
        </Link>
      </CardContent>
    </Card>
  )
}

export default Blog
