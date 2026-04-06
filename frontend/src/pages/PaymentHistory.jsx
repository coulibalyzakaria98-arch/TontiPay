import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPayments = async () => {
      try {
        const { data } = await api.get('/payments/my-payments');
        setPayments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPayments();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement de votre historique...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Historique des Paiements</h1>

      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className={`p-3 rounded-full ${
                  payment.statut === 'validated' ? 'bg-green-50 text-green-600' :
                  payment.statut === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {payment.statut === 'validated' ? <CheckCircle className="w-6 h-6" /> :
                   payment.statut === 'pending' ? <Clock className="w-6 h-6" /> :
                   <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{payment.tontine?.nom || 'Tontine'}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(payment.datePaiement).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <span className="text-xl font-black text-indigo-600">
                  {payment.montant.toLocaleString()} FCFA
                </span>
                <span className={`text-xs font-bold uppercase mt-1 ${
                  payment.statut === 'validated' ? 'text-green-600' :
                  payment.statut === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {payment.statut === 'validated' ? 'Validé' :
                   payment.statut === 'pending' ? 'En attente' :
                   'Refusé'}
                </span>
                <span className="text-xs text-gray-400 mt-1 font-mono">{payment.reference}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-500">Aucun paiement effectué pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
