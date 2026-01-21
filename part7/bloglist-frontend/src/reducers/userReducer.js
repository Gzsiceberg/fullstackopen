import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        if (user && user.token) {
          blogService.setToken(user.token)
          dispatch(setUser(user))
        }
      } catch {
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(setUser(user))
    return user
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch(clearUser())
  }
}

export default userSlice.reducer
