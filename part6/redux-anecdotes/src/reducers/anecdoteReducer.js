import { createSlice } from '@reduxjs/toolkit'
import { getAll, createNew, update } from '../services/anecdotes'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(anecdote =>
        anecdote.id === updated.id ? updated : anecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions

export const voteAnecdote = id => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = await update(id, { ...anecdote, votes: anecdote.votes + 1 })
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer
