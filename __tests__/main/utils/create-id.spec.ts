import { stringifyTimeBasedId } from '@main/utils/create-id'
import { assert } from '@blackglory/errors'

describe('stringifyTimeBasedId([timestamp: number, num: number]): string', () => {
  test('compare', () => {
    assert(stringifyTimeBasedId([0, 0]) < stringifyTimeBasedId([0, 1]))
    assert(stringifyTimeBasedId([0, 1]) < stringifyTimeBasedId([0, 10]))
    assert(stringifyTimeBasedId([0, 10]) < stringifyTimeBasedId([0, 999]))
    assert(stringifyTimeBasedId([0, 999]) < stringifyTimeBasedId([1, 0]))

    assert(stringifyTimeBasedId([1, 0]) < stringifyTimeBasedId([1, 1]))
    assert(stringifyTimeBasedId([1, 1]) < stringifyTimeBasedId([1, 10]))
    assert(stringifyTimeBasedId([1, 10]) < stringifyTimeBasedId([1, 999]))
    assert(stringifyTimeBasedId([1, 999]) < stringifyTimeBasedId([2, 0]))

    assert(stringifyTimeBasedId([1, 0]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([1, 1]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([1, 10]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([1, 999]) < stringifyTimeBasedId([10, 0]))

    assert(stringifyTimeBasedId([9, 0]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([9, 1]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([9, 10]) < stringifyTimeBasedId([10, 0]))
    assert(stringifyTimeBasedId([9, 999]) < stringifyTimeBasedId([10, 0]))

    assert(stringifyTimeBasedId([10, 0]) < stringifyTimeBasedId([10, 1]))
    assert(stringifyTimeBasedId([10, 1]) < stringifyTimeBasedId([10, 999]))
    assert(stringifyTimeBasedId([10, 999]) < stringifyTimeBasedId([11, 0]))
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
