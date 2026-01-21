import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Name</th>
              <th className="text-left py-2 font-medium">Blogs Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="py-2">
                  <Link to={`/users/${user.id}`} className="text-primary hover:underline">
                    {user.name}
                  </Link>
                </td>
                <td className="py-2">{user.blogs ? user.blogs.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default Users
