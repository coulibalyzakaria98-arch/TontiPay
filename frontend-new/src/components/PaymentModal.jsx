import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  Hash, 
  CreditCard, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const PaymentModal = ({ isOpen, onClose, tontine, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'orange',
    reference: '',
    transactionId: '',
    screenshotUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync amount when tontine changes
  React.useEffect(() => {
    if (tontine) {
      setFormData(prev => ({ ...prev, amount: tontine.montant }));
    }
  }, [tontine]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/payments', {
        tontineId: tontine._id,
        amount: Number(formData.amount),
        method: formData.method,
        reference: formData.reference,
        transactionId: formData.transactionId,
        screenshotUrl: formData.screenshotUrl || undefined,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ ...formData, reference: '' });
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission. Vérifiez les informations.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Déclarer un paiement</h2>
            <p className="text-xs text-gray-500 font-medium">{tontine?.nom}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Demande envoyée !</h3>
            <p className="text-gray-500 text-sm">En attente de validation par l'administrateur.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Montant versé (FCFA)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="number" required value={formData.amount} onChange={(e)=>setFormData({...formData, amount: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Moyen de paiement</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select value={formData.method} onChange={(e)=>setFormData({...formData, method: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 appearance-none">
                    <option value="orange">Orange Money</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="moov">Moov Money</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Référence de transaction</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required placeholder="Ex: code de transaction" value={formData.reference} onChange={(e)=>setFormData({...formData, reference: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ID dépôt Mobile Money</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required placeholder="Ex: 123456789" value={formData.transactionId} onChange={(e)=>setFormData({...formData, transactionId: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Preuve (URL facultative)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="url" placeholder="URL de capture d'écran" value={formData.screenshotUrl} onChange={(e)=>setFormData({...formData, screenshotUrl: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white p-5 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Soumettre le paiement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
