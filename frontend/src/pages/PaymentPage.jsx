import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CreditCard } from 'lucide-react';

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
      await api.post('/api/payments', {
        tontineId,
        montant,
        reference,
      });
      alert('Paiement soumis avec succès ! En attente de validation.');
      navigate(`/tontines/${tontineId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  if (!tontine) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-80" />
          <h2 className="text-2xl font-bold">Effectuer un paiement</h2>
          <p className="text-indigo-100 text-sm">{tontine.nom}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Montant (FCFA)
            </label>
            <input
              type="number"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Référence de transaction
            </label>
            <input
              type="text"
              placeholder="Ex: TXN123456789"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Soumission...' : 'Confirmer le paiement'}
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Votre paiement sera vérifié par un administrateur sous 24h.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
