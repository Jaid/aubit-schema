import zod from 'zod'

import idSchema from './lib/id.zod.ts'
import itemSchema from './lib/item.zod.ts'

const schema = zod.strictObject({
  entries: zod.record(idSchema, itemSchema),
})

export default schema
