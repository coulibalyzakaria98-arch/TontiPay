import React, { useState } from 'react';
import { X, Banknote, Smartphone, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const PaymentModal = ({ isOpen, onClose, tontine, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    montant: tontine?.montant || '',
    moyenPaiement: 'Orange Money',
    reference: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/payments', {
        tontineId: tontine._id,
        ...formData,
        montant: Number(formData.montant),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="p-12 text-center">
            <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Déclaré !</h2>
            <p className="text-gray-500">Votre paiement est en attente de validation par l'administrateur.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Déclarer un paiement</h2>
              <p className="text-gray-500 mt-1 text-sm">Remplissez les détails de votre transaction.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <Banknote size={14} /> Montant versé
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <Smartphone size={14} /> Moyen de paiement
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                  value={formData.moyenPaiement}
                  onChange={(e) => setFormData({ ...formData, moyenPaiement: e.target.value })}
                >
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Moov Money">Moov Money</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <Hash size={14} /> Référence de transaction
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Ex: PP220130.1245.A001"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <span>Confirmer le paiement</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
