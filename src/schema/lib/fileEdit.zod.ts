import zod from 'zod'

import regexPatternSchema from './regexPattern.zod.ts'

const needleSchema = zod.union([
  zod.string(),
  regexPatternSchema,
  zod.strictObject({
    line: zod.int().min(1).describe('1-indexed line number'),
  }),
])
const fileEditSchema = zod.discriminatedUnion('action', [
  zod.strictObject({
    action: zod.literal('delete'),
  }),
  zod.strictObject({
    action: zod.literal('ensure'),
  }),
  zod.strictObject({
    action: zod.literal('empty'),
  }),
  zod.strictObject({
    action: zod.literal('rename'),
    to: zod.string().describe('new name of the file or folder'),
  }),
  zod.strictObject({
    action: zod.literal('move'),
    to: zod.string().describe('new path of the file or folder'),
  }),
  zod.strictObject({
    action: zod.literal('overwrite'),
    content: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('append'),
    content: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('prepend'),
    content: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('edit'),
    needle: needleSchema,
    replacement: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('insert_before'),
    needle: needleSchema,
    content: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('insert_after'),
    needle: needleSchema,
    content: zod.string(),
  }),
  zod.strictObject({
    action: zod.literal('erase'),
    needle: needleSchema,
  }),
])

export default fileEditSchema
