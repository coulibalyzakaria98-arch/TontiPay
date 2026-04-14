import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  Hash, 
  CreditCard, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Wallet
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

  const paymentMethods = [
    { id: 'orange', label: 'Orange Money', color: 'bg-[#FF7900]', textColor: 'text-white' },
    { id: 'mtn', label: 'MTN MoMo', color: 'bg-[#FFCC00]', textColor: 'text-black' },
    { id: 'moov', label: 'Moov Money', color: 'bg-[#0055A4]', textColor: 'text-white' },
    { id: 'physique', label: 'Espèces', color: 'bg-green-600', textColor: 'text-white' }
  ];

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
        transactionId: formData.transactionId || formData.reference, // fallback if empty
        screenshotUrl: formData.screenshotUrl || undefined,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ ...formData, reference: '', transactionId: '' });
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
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Payer ma part</h2>
            <p className="text-xs text-gray-500 font-medium italic">Tontine : {tontine?.nom}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Déclaration reçue !</h3>
            <p className="text-gray-500 text-sm">L'administrateur va vérifier votre dépôt et valider votre paiement.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2 animate-shake">
                <AlertCircle size={16}/>{error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Montant à verser</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    required 
                    readOnly={tontine?.montant > 0}
                    value={formData.amount} 
                    onChange={(e)=>setFormData({...formData, amount: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-black text-gray-900 focus:ring-2 focus:ring-primary-500" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">FCFA</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Méthode utilisée</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({...formData, method: m.id})}
                      className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border-2 ${
                        formData.method === m.id 
                          ? `${m.color} ${m.textColor} border-transparent shadow-lg scale-105` 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {m.id === 'physique' ? <Wallet size={14} /> : <Smartphone size={14} />}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">
                  {formData.method === 'physique' ? 'ID du reçu physique' : 'Référence de transaction'}
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: T240312.1234.C..." 
                    value={formData.reference} 
                    onChange={(e)=>setFormData({...formData, reference: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>

              {formData.method !== 'physique' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest italic">Preuve (Lien URL facultatif)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={formData.screenshotUrl} 
                      onChange={(e)=>setFormData({...formData, screenshotUrl: e.target.value})} 
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary-600 text-white p-5 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-primary-700 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <CheckCircle2 size={18} />
                  Confirmer mon dépôt
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
