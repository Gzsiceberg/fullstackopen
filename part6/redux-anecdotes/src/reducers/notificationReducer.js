import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    }
  }
})

export const { showNotification, removeNotification } = notificationSlice.actions

export const setNotification = (content, seconds) => {
  return async dispatch => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
