import filterReducer from '../filterReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('filterReducer', () => {
  test('returns initial state', () => {
    const state = undefined
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = filterReducer(state, action)
    expect(newState).toBe('')
  })

  test('changes filter with action SET_FILTER', () => {
    const state = ''
    const action = {
      type: 'SET_FILTER',
      payload: 'all'
    }

    deepFreeze(state)
    const newState = filterReducer(state, action)

    expect(newState).toBe('all')
  })
})
