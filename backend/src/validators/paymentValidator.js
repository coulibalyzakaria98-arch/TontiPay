const { z } = require('zod');

/**
 * Schéma de création de paiement
 */
const createPaymentSchema = z.object({
  tontineId: z.string().min(24, "ID Tontine invalide"),
  amount: z.number().positive("Le montant doit être supérieur à 0"),
  method: z.enum(['orange', 'mtn', 'moov'], {
    errorMap: () => ({ message: "Méthode de paiement non supportée" })
  }),
  reference: z.string().min(3, "La référence de transaction est obligatoire"),
  transactionId: z.string().min(3, "L'ID de transaction est obligatoire"),
  screenshotUrl: z.string().url("URL de preuve invalide").optional(),
});

/**
 * Schéma de validation admin
 */
const validatePaymentSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: "Le statut doit être 'approved' ou 'rejected'" })
  }),
  reason: z.string().optional()
}).refine((data) => {
  if (data.status === 'rejected' && (!data.reason || data.reason.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Une raison est obligatoire en cas de rejet",
  path: ["reason"]
});

module.exports = {
  createPaymentSchema,
  validatePaymentSchema
};
