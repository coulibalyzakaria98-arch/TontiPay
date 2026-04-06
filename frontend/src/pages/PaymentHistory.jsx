import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Loader2, DollarSign } from 'lucide-react';
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Historique des transactions</h1>
        <p className="text-gray-500 mb-10 text-sm">Suivez l'état de vos cotisations en temps réel.</p>

        {payments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {payments.map((payment) => (
              <div key={payment._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-5 mb-4 md:mb-0">
                    <div className={`p-4 rounded-2xl ${
                      payment.statut === 'validated' ? 'bg-green-50 text-green-600' :
                      payment.statut === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {payment.statut === 'validated' ? <CheckCircle className="w-6 h-6" /> :
                       payment.statut === 'pending' ? <Clock className="w-6 h-6" /> :
                       <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{payment.tontine?.nom || 'Tontine'}</h3>
                      <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(payment.datePaiement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-black text-indigo-600">
                        {payment.montant.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-gray-400">FCFA</span>
                    </div>
                    <div className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full ${
                      payment.statut === 'validated' ? 'bg-green-100 text-green-700' :
                      payment.statut === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.statut === 'validated' ? 'Validé' :
                       payment.statut === 'pending' ? 'En attente' :
                       'Refusé'}
                    </div>
                    <span className="text-[9px] font-mono text-gray-300 mt-2">REF: {payment.reference}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 py-24 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aucune transaction</h3>
            <p className="text-gray-500 mt-2 text-sm">Vos futurs paiements apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
