import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CreditCard, DollarSign, FileText, Loader2, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
  const { tontineId } = useParams();
  const navigate = useNavigate();
  const [tontine, setTontine] = useState(null);
  const [montant, setMontant] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTontine = async () => {
      try {
        const { data } = await api.get(`/tontines/${tontineId}`);
        setTontine(data.data.tontine);
        setMontant(data.data.tontine.montant);
      } catch (err) {
        setError('Impossible de récupérer les détails de la tontine');
      }
    };
    fetchTontine();
  }, [tontineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/payments', {
        tontineId,
        montant,
        reference,
      });
      navigate(`/tontines/${tontineId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  if (!tontine) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-white text-center">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-2">Effectuer un paiement</h2>
            <p className="text-indigo-100 text-sm font-medium">Tontine : <span className="text-white font-bold">{tontine.nom}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Montant à verser
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <DollarSign className="h-6 w-6 text-indigo-500" />
                </div>
                <input
                  type="number"
                  className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 transition-all outline-none font-black text-2xl"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                  <span className="font-black text-gray-300">FCFA</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Référence de transaction
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <FileText className="h-6 w-6 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Ex: MP230406.1234.C..."
                  className="block w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
              <div className="flex space-x-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                  Votre paiement sera mis en attente et vérifié manuellement par un administrateur. Le statut sera mis à jour dans votre historique.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-5 px-4 border border-transparent text-xl font-black rounded-3xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                'Confirmer le versement'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
