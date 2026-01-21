import { useState, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div className="space-y-4">
      {!visible && (
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      )}
      {visible && (
        <div className="space-y-4">
          {props.children}
          <Button variant="outline" onClick={toggleVisibility}>Cancel</Button>
        </div>
      )}
    </div>
  )
}

export default Togglable