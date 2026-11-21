import {expect, test} from 'bun:test'

import schema, {jsonSchema, reportSchema} from '#src/main.ts'

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
const finding = {
  title: 'A valid finding title',
  category: 'correctness',
}
test('a report accepts unreviewed artifact entries without adding review defaults', () => {
  const artifact = {entries: {sample: finding}}
  expect(reportSchema.parse(artifact)).toEqual(schema.parse(artifact))
})
test('review metadata belongs to individual report entries', () => {
  const entries = {
    first: {
      ...finding,
      state: 'resolved',
      visible: false,
      comment: 'Fixed upstream.',
    },
    second: {
      ...finding,
      state: 'open',
    },
    third: {
      ...finding,
      state: 'rejected',
    },
    fourth: {
      ...finding,
      visible: true,
    },
  }
  expect(reportSchema.parse({entries}).entries).toMatchObject(entries)
  for (const review of [{state: 'open'}, {visible: false}, {comment: 'Fixed upstream.'}]) {
    expect(schema.safeParse({entries: {sample: {
      ...finding,
      ...review,
    }}}).success).toBe(false)
  }
})
test('report entries enforce review types, artifact constraints and strict keys', () => {
  for (const invalid of [{state: 'closed'}, {visible: 'false'}, {comment: null}, {review: {}}, {title: 'short'}]) {
    expect(reportSchema.safeParse({entries: {sample: {
      ...finding,
      ...invalid,
    }}}).success).toBe(false)
  }
  expect(reportSchema.safeParse({entries: {_invalid: finding}}).success).toBe(false)
})
