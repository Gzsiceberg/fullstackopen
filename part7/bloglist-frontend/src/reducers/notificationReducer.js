import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId = null

export const showNotification = (message, type = 'success', duration = 5) => {
  return dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    dispatch(setNotification({ message, type }))
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000)
  }
}

export default notificationSlice.reducer
