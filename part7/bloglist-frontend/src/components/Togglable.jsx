import { useState, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {!visible && (
        <Button size="lg" onClick={toggleVisibility}>
          + {props.buttonLabel}
        </Button>
      )}
      {visible && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {props.children}
            <Button variant="outline" onClick={toggleVisibility}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Togglable