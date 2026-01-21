import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const successStyle = {
    ...notificationStyle,
    color: 'green',
    borderColor: 'green'
  }

  const errorStyle = {
    ...notificationStyle,
    color: 'red',
    borderColor: 'red'
  }

  const style = notification.type === 'error' ? errorStyle : successStyle

  return (
    <div style={style} className={notification.type === 'error' ? 'error' : 'success'}>
      {notification.message}
    </div>
  )
}

export default Notification
