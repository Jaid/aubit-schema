import zod from 'zod'

import schema from './document.zod.ts'

const jsonSchema = zod.toJSONSchema(schema, {
  io: 'input',
  reused: 'ref',
})

export default jsonSchema
