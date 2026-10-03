import {expect, test} from 'bun:test'

import schema, {categorySchema, jsonSchema, prioritySchema} from '#src/main.ts'

test('parses valid Aubit data and applies defaults', () => {
  const result = schema.parse({entries: {sample: {
    title: 'A valid finding title',
    category: 'correctness',
  }}})
  expect(result.entries.sample.priority).toBe(3)
})
test('exports category and priority schemas', () => {
  expect(categorySchema.parse('security.leak')).toBe('security.leak')
  expect(prioritySchema.parse(0)).toBe(0)
})
test('exports JSON Schema', () => {
  expect(jsonSchema.type).toBe('object')
  expect(jsonSchema.properties).toHaveProperty('entries')
})
