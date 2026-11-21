import zod from 'zod'

import arrayable from '#src/arrayable.ts'

const regexpFlagsSchema = zod.union([
  zod.literal('v').describe('enhanced Unicode support'),
  zod.literal('i').describe('case-insensitive'),
  zod.literal('m').describe('multiline'),
  zod.literal('s').describe('dotAll'),
]).describe('ECMAScript RegExp flags')
const regexPatternSchema = zod.strictObject({
  regex: zod.string(),
  flags: arrayable(regexpFlagsSchema).default('v'),
})

export default regexPatternSchema
