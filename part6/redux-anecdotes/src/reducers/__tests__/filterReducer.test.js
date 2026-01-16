import filterReducer from '../filterReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('filterReducer', () => {
  test('returns initial state', () => {
    const state = undefined
    const action = {
      type: 'filter/default'
    }

    const newState = filterReducer(state, action)
    expect(newState).toBe('')
  })

  test('changes filter with action filter/setFilter', () => {
    const state = ''
    const action = {
      type: 'filter/setFilter',
      payload: 'all'
    }

    deepFreeze(state)
    const newState = filterReducer(state, action)

    expect(newState).toBe('all')
  })
})
