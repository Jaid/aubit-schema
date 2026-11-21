import zod from 'zod'

import idSchema from './lib/id.zod.ts'
import reportSchema from './report.zod.ts'

const schema = reportSchema.extend({
  collection: zod.record(idSchema, reportSchema).optional(),
})

export default schema
