import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const User = () => {
  const { id } = useParams()
  const users = useSelector((state) => state.users)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">Added Blogs</h3>
        <ul className="list-disc list-inside space-y-1">
          {user.blogs &&
            user.blogs.map((blog) => (
              <li key={blog.id} className="text-muted-foreground">{blog.title}</li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default User
