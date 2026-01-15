import React, { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <>
      <button onClick={toggleVisibility}>{visible ? 'hide' : props.buttonLabel}</button>
      <div style={showWhenVisible}>
        {props.children}
      </div>
    </>
  )
}

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <Togglable buttonLabel="view">
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes} <button>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog