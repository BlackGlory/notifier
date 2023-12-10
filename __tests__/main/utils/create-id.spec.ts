import { describe, test, expect } from 'vitest'
import { stringifyTimeBasedId } from '@main/utils/create-id.js'
import { assert } from '@blackglory/prelude'

describe('stringifyTimeBasedId([timestamp: number, num: number]): string', () => {
  test('compare', () => {
    assert(stringifyTimeBasedId([0, 0]) < stringifyTimeBasedId([0, 1]), 'expect (0,0) < (0,1)')
    assert(stringifyTimeBasedId([0, 1]) < stringifyTimeBasedId([0, 10]), 'expect (0,1) < (0,10)')
    assert(stringifyTimeBasedId([0, 10]) < stringifyTimeBasedId([0, 999]), 'expect (0,10) < (0,999)')
    assert(stringifyTimeBasedId([0, 999]) < stringifyTimeBasedId([1, 0]), 'expect (0,999) < (1,0)')

    assert(stringifyTimeBasedId([1, 0]) < stringifyTimeBasedId([1, 1]), 'expect (1,0) < (1,1)')
    assert(stringifyTimeBasedId([1, 1]) < stringifyTimeBasedId([1, 10]), 'expect (1,1) < (1,10)')
    assert(stringifyTimeBasedId([1, 10]) < stringifyTimeBasedId([1, 999]), 'expect (1,10) < (1,999)')
    assert(stringifyTimeBasedId([1, 999]) < stringifyTimeBasedId([2, 0]), 'expect (1,999) < (2,0)')

    assert(stringifyTimeBasedId([1, 0]) < stringifyTimeBasedId([10, 0]), 'expect (1,0) < (10,0)')
    assert(stringifyTimeBasedId([1, 1]) < stringifyTimeBasedId([10, 0]), 'expect (1,1) < (10,0)')
    assert(stringifyTimeBasedId([1, 10]) < stringifyTimeBasedId([10, 0]), 'expect (1,10) < (10,0)')
    assert(stringifyTimeBasedId([1, 999]) < stringifyTimeBasedId([10, 0]), 'expect (1,999) < (10,0)')

    assert(stringifyTimeBasedId([9, 0]) < stringifyTimeBasedId([10, 0]), 'expect (9,0) < (10,0)')
    assert(stringifyTimeBasedId([9, 1]) < stringifyTimeBasedId([10, 0]), 'expect (9,1) < (10,0)')
    assert(stringifyTimeBasedId([9, 10]) < stringifyTimeBasedId([10, 0]), 'expect (9,10) < (10,0)')
    assert(stringifyTimeBasedId([9, 999]) < stringifyTimeBasedId([10, 0]), 'expect (9,999) < (10,0)')

    assert(stringifyTimeBasedId([10, 0]) < stringifyTimeBasedId([10, 1]), 'expect (10,0) < (10,1)')
    assert(stringifyTimeBasedId([10, 1]) < stringifyTimeBasedId([10, 999]), 'expect (10,1) < (10,999)')
    assert(stringifyTimeBasedId([10, 999]) < stringifyTimeBasedId([11, 0]), 'expect (10,999) < (11,0)')
  })

  test('snapshot', () => {
    expect(stringifyTimeBasedId([0, 0])).toMatchSnapshot()
    expect(stringifyTimeBasedId([0, 1])).toMatchSnapshot()
    expect(stringifyTimeBasedId([0, 10])).toMatchSnapshot()
    expect(stringifyTimeBasedId([0, 999])).toMatchSnapshot()

    expect(stringifyTimeBasedId([1, 0])).toMatchSnapshot()
    expect(stringifyTimeBasedId([1, 1])).toMatchSnapshot()
    expect(stringifyTimeBasedId([1, 10])).toMatchSnapshot()
    expect(stringifyTimeBasedId([1, 999])).toMatchSnapshot()

    expect(stringifyTimeBasedId([9, 0])).toMatchSnapshot()
    expect(stringifyTimeBasedId([9, 1])).toMatchSnapshot()
    expect(stringifyTimeBasedId([9, 10])).toMatchSnapshot()
    expect(stringifyTimeBasedId([9, 999])).toMatchSnapshot()

    expect(stringifyTimeBasedId([10, 0])).toMatchSnapshot()
    expect(stringifyTimeBasedId([10, 1])).toMatchSnapshot()
    expect(stringifyTimeBasedId([10, 999])).toMatchSnapshot()
  })
})
