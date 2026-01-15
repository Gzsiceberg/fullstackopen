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

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = currentUser && blog.user === currentUser.id
  console.log('Blog user:', blog.user, 'Current user:', currentUser)

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author} <Togglable buttonLabel="view">
          <div className="blog-url">
            {blog.url}
          </div>
          <div className="blog-likes">
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>
            {blog.user ? blog.user.name : 'unknown'}
          </div>
          {isOwner && <button onClick={() => handleDelete(blog)}>remove</button>}
        </Togglable>
      </div>
    </div>
  )
}

export default Blog