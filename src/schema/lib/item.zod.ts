import zod from 'zod'

import arrayable from '#src/arrayable.ts'

import fileEditSchema from './fileEdit.zod.ts'

const categorySchema = zod.union([
  zod.literal('correctness'),
  zod.literal('consistency'),
  zod.literal('consistency.patterns').describe('unnecessarily mixed approaches in a single architectural context'),
  zod.literal('consistency.naming'),
  zod.literal('consistency.behavior'),
  zod.literal('consistency.style'),
  zod.literal('security'),
  zod.literal('security.leak').describe('sensitive data exposed in non-gitignored places'),
  zod.literal('resilience'),
  zod.literal('hygiene'),
  zod.literal('performance'),
  zod.literal('accessibility'),
  zod.literal('language').describe('issues regarding human language'),
  zod.literal('language.spelling').describe('spelling mistakes / typos'),
  zod.literal('language.formatting'),
  zod.literal('language.dialect').describe('issues like British wording in a mostly American codebase'),
  zod.literal('language.grammar').describe('grammatical issues'),
  zod.literal('language.style'),
  zod.literal('documentation'),
  zod.literal('documentation.mismatch').describe('described behavior is out of sync with actual behavior'),
  zod.literal('misc'),
])
const prioritySchema = zod.union([
  zod.literal(0).describe('P0 – critical'),
  zod.literal(1).describe('P1 – high'),
  zod.literal(2).describe('P2 – moderate'),
  zod.literal(3).describe('P3 – low'),
  zod.literal(4).describe('P4 – trivial'),
])
const itemSchema = zod.strictObject({
  title: zod.string().min(8).max(127).regex(/^[^\t\n\r\u{2028}\u{2029}]*$/u),
  description: zod.string().optional(),
  priority: prioritySchema.default(3),
  category: arrayable(categorySchema),
  suggestedChanges: zod.array(zod.strictObject({
    file: zod.string().nonempty(),
    edit: arrayable(fileEditSchema),
  })).optional(),
})

export default itemSchema
