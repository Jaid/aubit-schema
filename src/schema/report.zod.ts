import zod from 'zod'

import idSchema from './lib/id.zod.ts'
import itemSchema from './lib/item.zod.ts'

const reviewSchema = zod.strictObject({
  state: zod.enum(['open', 'resolved', 'rejected']).optional(),
  visible: zod.boolean().optional(),
  comment: zod.string().optional(),
})
const schema = zod.strictObject({
  entries: zod.record(idSchema, itemSchema.extend(reviewSchema.shape)),
})

export default schema
