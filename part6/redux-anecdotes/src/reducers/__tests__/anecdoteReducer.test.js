import anecdoteReducer, { createAnecdote, voteAnecdote } from '../anecdoteReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = []
    const action = createAnecdote('the app state is stored in a single store')

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContain('the app state is stored in a single store')
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

    const action = voteAnecdote('1')

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
