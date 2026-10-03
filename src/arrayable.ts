import zod from 'zod'

const arrayable = <Schema extends zod.ZodType>(schema: Schema) => {
  return zod.union([schema, zod.array(schema).nonempty()])
}

export default arrayable
