import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    address: vine.string().maxLength(500).optional(),
    assignedAgentId: vine.number().positive().optional(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      })
      .optional(),
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