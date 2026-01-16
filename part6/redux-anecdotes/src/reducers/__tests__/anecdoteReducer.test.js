import anecdoteReducer from '../anecdoteReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('anecdoteReducer', () => {
  test('returns new state with action anecdotes/appendAnecdote', () => {
    const state = []
    const action = {
      type: 'anecdotes/appendAnecdote',
      payload: {
        content: 'the app state is stored in a single store',
        id: '1',
        votes: 0
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContain('the app state is stored in a single store')
  } )

  test('returns new state with action anecdotes/updateAnecdote', () => {
    const state = [
      {
        content: 'the app state is stored in a single store',
        id: '1',
        votes: 0
      },
      {
        content: 'in-house communication is key',
        id: '2',
        votes: 0
      }
    ]

    const action = {
      type: 'anecdotes/updateAnecdote',
      payload: {
        content: 'the app state is stored in a single store',
        id: '1',
        votes: 1
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(2)
    expect(newState).toContainEqual(state[1])
    expect(newState).toContainEqual({
      content: 'the app state is stored in a single store',
      id: '1',
      votes: 1
    })
  })
})
