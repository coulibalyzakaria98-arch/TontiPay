import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments');
      setPayments(data.data);
    } catch (err) {
      setError('Impossible de charger les paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (!window.confirm(`Voulez-vous vraiment ${action === 'validate' ? 'valider' : 'refuser'} ce paiement ?`)) return;

    try {
      await api.put(`/payments/${id}/${action}`);
      alert(`Paiement ${action === 'validate' ? 'validé' : 'refusé'} !`);
      fetchPayments();
    } catch (err) {
      alert('Une erreur est survenue');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Validation des Paiements</h1>
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          {payments.filter(p => p.statut === 'pending').length} en attente
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tontine</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Montant / Réf</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{payment.user.prenom} {payment.user.nom}</div>
                    <div className="text-xs text-gray-500">{payment.user.telephone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {payment.tontine?.nom || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-indigo-600">{payment.montant.toLocaleString()} FCFA</div>
                    <div className="text-xs font-mono text-gray-400">{payment.reference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      payment.statut === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                      payment.statut === 'validated' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {payment.statut === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {payment.statut === 'validated' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {payment.statut === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {payment.statut.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.statut === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(payment._id, 'validate')}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all"
                          title="Valider"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction(payment._id, 'reject')}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          title="Refuser"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Traité</span>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
