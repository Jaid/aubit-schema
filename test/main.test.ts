import {expect, test} from 'bun:test'

const {default: aubitSchema} = await import('#src/main.ts')
test('should run', () => {
  const result = aubitSchema()
  expect(result).toBe('aubit-schema') // TODO Test actual functionality
})
