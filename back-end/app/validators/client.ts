import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().optional(),
    address: vine.string().maxLength(500).optional(),
    assignedAgentId: vine.number().positive().optional(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(100)
      .optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50).optional(),
    lastName: vine.string().trim().minLength(2).maxLength(50).optional(),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().optional(),
    address: vine.string().maxLength(500).optional(),
    assignedAgentId: vine.number().positive().optional(),
  })
)