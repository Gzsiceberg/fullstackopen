import anecdoteReducer from '../anecdoteReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = []
    const action = {
      type: 'NEW_ANECDOTE',
      data: {
        content: 'the app state is stored in a single store'
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContain(action.data.content)
  })

  test('returns new state with action VOTE', () => {
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
      type: 'VOTE',
      data: { id: '1' }
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
