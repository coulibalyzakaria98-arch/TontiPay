import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Calendar,
  Wallet,
  PlusCircle
} from 'lucide-react';
import api from '../services/api';
import PaymentModal from '../components/PaymentModal';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPaid: 0, pendingCount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await api.get('/payments/my-payments');
      const data = response.data.data;
      setPayments(data);

      // Calculate simple stats
      const total = data
        .filter(p => p.statut === 'validated')
        .reduce((acc, curr) => acc + curr.montant, 0);
      const pending = data.filter(p => p.statut === 'pending').length;
      
      setStats({ totalPaid: total, pendingCount: pending });
    } catch (err) {
      console.error("Erreur lors du chargement des paiements", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPayments} 
      />

      {/* Header */}
      <header className="bg-white border-b px-6 py-8 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="text-primary-600" /> Mes Transactions
            </h1>
            <p className="text-gray-500 text-sm">Suivez l'historique de vos cotisations</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white p-2 md:px-4 md:py-2 rounded-full md:rounded-xl shadow-lg hover:bg-primary-700 transition-all flex items-center gap-2"
          >
            <PlusCircle size={24} />
            <span className="hidden md:inline font-bold">Déclarer un paiement</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 mt-4">
        
        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between overflow-hidden relative">
            <Wallet size={80} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
            <div className="relative z-10">
              <p className="text-primary-100 text-xs font-bold uppercase tracking-widest">Total Cotisé</p>
              <p className="text-3xl font-black mt-1">{stats.totalPaid.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <ArrowUpRight size={24} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">En attente</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.pendingCount}</p>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
              <Clock size={24} />
            </div>
          </div>
        </section>

        {/* Transactions List */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 px-1">Dernières activités</h2>
          
          <div className="space-y-3">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        p.statut === 'validated' ? 'bg-green-50 text-green-600' : 
                        p.statut === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.statut === 'validated' ? <CheckCircle2 size={20} /> : 
                         p.statut === 'pending' ? <Clock size={20} /> : <XCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {p.tontine?.nom || 'Tontine supprimée'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded">
                            {p.moyenPaiement}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(p.datePaiement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-black text-gray-900">-{p.montant.toLocaleString()} FCFA</p>
                      <p className={`text-[10px] font-black uppercase mt-1 ${
                        p.statut === 'validated' ? 'text-green-600' : 
                        p.statut === 'pending' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {p.statut === 'validated' ? 'Validé' : 
                         p.statut === 'pending' ? 'En attente' : 'Refusé'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-[10px]">
                    <div className="flex gap-4">
                      <span className="text-gray-400 font-bold uppercase">Réf: <span className="text-gray-600 font-mono">{p.reference}</span></span>
                      <span className="text-gray-400 font-bold uppercase">Tour: <span className="text-gray-600">{p.tour}</span></span>
                    </div>
                    {p.dateValidation && (
                      <span className="text-gray-300 italic font-medium">Validé le {new Date(p.dateValidation).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Aucune transaction</h3>
                <p className="text-gray-500 text-sm mt-1">Vos paiements apparaîtront ici dès que vous commencerez à cotiser.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Payments;
