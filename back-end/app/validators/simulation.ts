import vine from '@vinejs/vine'

export const createSimulationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    clientId: vine.number().positive().optional(),
    parameters: vine.object({
      loanAmount: vine.number().positive().max(10000000), // Max 10M€
      duration: vine.number().positive().min(1).max(30), // 1-30 ans
      interestRate: vine.number().min(0).max(20), // 0-20%
      insuranceRate: vine.number().min(0).max(5), // 0-5%
      downPayment: vine.number().min(0),
      notaryFees: vine.number().min(0).max(100), // 0-100%
      agencyFees: vine.number().min(0).max(100), // 0-100%
      propertyValue: vine.number().positive(),
      monthlyIncome: vine.number().min(0).optional(),
      monthlyCharges: vine.number().min(0).optional(),
      travaux: vine.number().min(0).optional(),
      revalorisationBien: vine.number().min(-10).max(20).optional(), // -10% à +20%
    }),
  })
)

export const updateSimulationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    clientId: vine.number().positive().optional(),
    parameters: vine.object({
      loanAmount: vine.number().positive().max(10000000).optional(),
      duration: vine.number().positive().min(1).max(30).optional(),
      interestRate: vine.number().min(0).max(20).optional(),
      insuranceRate: vine.number().min(0).max(5).optional(),
      downPayment: vine.number().min(0).optional(),
      notaryFees: vine.number().min(0).max(100).optional(),
      agencyFees: vine.number().min(0).max(100).optional(),
      propertyValue: vine.number().positive().optional(),
      monthlyIncome: vine.number().min(0).optional(),
      monthlyCharges: vine.number().min(0).optional(),
      travaux: vine.number().min(0).optional(),
      revalorisationBien: vine.number().min(-10).max(20).optional(),
    }).optional(),
  })
)