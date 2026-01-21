import { useSelector } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  const isError = notification.type === 'error'

  return (
    <Card className={`mb-4 ${isError ? 'border-destructive bg-destructive/10' : 'border-green-500 bg-green-50'}`}>
      <CardContent className="py-3">
        <p className={isError ? 'text-destructive' : 'text-green-700'}>
          {notification.message}
        </p>
      </CardContent>
    </Card>
  )
}

export default Notification
