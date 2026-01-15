const Notification = ({ message, type }) => {
  if (!message) {
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

  const style = type === 'error' ? errorStyle : successStyle

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
