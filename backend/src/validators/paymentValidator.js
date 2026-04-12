const { z } = require('zod');

const createPaymentSchema = z.object({
  tontineId: z.string().min(24, "ID Tontine invalide"),
  amount: z.number().positive("Le montant doit être supérieur à 0"),
  method: z.enum(['orange', 'mtn', 'moov'], {
    errorMap: () => ({ message: "Méthode de paiement invalide" })
  }),
  reference: z.string().min(3, "La référence est obligatoire"),
});

const validatePaymentSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: "Le statut doit être 'approved' ou 'rejected'" })
  }),
  reason: z.string().optional(),
}).refine((data) => {
  if (data.status === 'rejected' && !data.reason) {
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
