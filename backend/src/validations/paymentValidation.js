const { z } = require('zod');

const paymentSchema = z.object({
  tontineId: z.string().min(24, "ID de tontine invalide (MongoDB ID attendu)"),
  montant: z.number().positive("Le montant doit être supérieur à 0"),
  reference: z.string().min(3, "La référence de transaction est obligatoire"),
  moyenPaiement: z.enum([
    'Orange Money', 
    'MTN Mobile Money', 
    'Moov Money', 
    'Wave', 
    'Espèces / Remise directe'
  ], {
    errorMap: () => ({ message: "Moyen de paiement non supporté" })
  }),
  preuve: z.string().optional(),
});

const validationSchema = z.object({
  statut: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: "Le statut doit être 'approved' ou 'rejected'" })
  }),
  reason: z.string().optional(),
});

module.exports = {
  paymentSchema,
  validationSchema,
};
