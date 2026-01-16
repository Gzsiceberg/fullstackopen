import filterReducer, { setFilter } from '../filterReducer'
import deepFreeze from 'deep-freeze'
import { describe, test, expect } from 'vitest'

describe('filterReducer', () => {
  test('returns initial state', () => {
    const state = undefined
    const action = setFilter('')

    const newState = filterReducer(state, action)
    expect(newState).toBe('')
  })

  test('changes filter with action filter/setFilter', () => {
    const state = ''
    const action = setFilter('all')
    deepFreeze(state)
    const newState = filterReducer(state, action)
    expect(newState).toBe('all')
  })
})
