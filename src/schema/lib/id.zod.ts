import zod from 'zod'

const idSchema = zod.string().min(1).max(31).regex(/^(?!_)\w*[0-9a-z]$/i)

export default idSchema
