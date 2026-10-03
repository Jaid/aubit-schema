import {expect, test} from 'bun:test'

import schema, {jsonSchema} from '#src/main.ts'

test('parses valid Aubit data and applies defaults', () => {
  const result = schema.parse({entries: {sample: {
    title: 'A valid finding title',
    category: 'correctness',
  }}})
  expect(result.entries.sample.priority).toBe(3)
})
test('rejects invalid categories', () => {
  expect(schema.safeParse({entries: {sample: {
    title: 'A valid finding title',
    category: 'not-a-category',
  }}}).success).toBe(false)
})
test('exports JSON Schema', () => {
  expect(jsonSchema.type).toBe('object')
  expect(jsonSchema.properties).toHaveProperty('entries')
})
