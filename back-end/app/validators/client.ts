import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    address: vine.string().maxLength(500).optional(),
    assignedAgentId: vine.number().positive().optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50).optional(),
    lastName: vine.string().trim().minLength(2).maxLength(50).optional(),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    address: vine.string().maxLength(500).optional(),
    assignedAgentId: vine.number().positive().optional(),
  })
)