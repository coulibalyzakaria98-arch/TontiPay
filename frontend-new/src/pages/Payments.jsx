import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter,
  Loader2,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PaymentModal from '../components/PaymentModal';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tontines, setTontines] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTontine, setSelectedTontine] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      // Utilisation du nouvel endpoint paginé
      const response = await api.get(`/payments/my-history?page=${page}`);
      setPayments(response.data.payments);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Erreur chargement paiements", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchTontines = useCallback(async () => {
    try {
      const response = await api.get('/tontines/my-tontines');
      setTontines(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedTontine(response.data.data[0]);
      }
    } catch (error) {
      console.error("Erreur chargement tontines", error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchTontines();
  }, [fetchPayments, fetchTontines]);

  const handleDownloadReceipt = async (paymentId, receiptId) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL || 'https://tontipay.onrender.com/api'}/payments/${paymentId}/receipt`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Recu-${receiptId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Le reçu n'est pas encore prêt ou vous n'y avez pas accès.");
      }
    } catch (error) {
      console.error("Erreur téléchargement", error);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'APPROUVÉ', border: 'border-emerald-100' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'REJETÉ', border: 'border-red-100' };
      default:
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'EN ATTENTE', border: 'border-amber-100' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        tontine={selectedTontine}
        onSuccess={() => {
          fetchPayments();
          if (tontines.length > 0) {
            setSelectedTontine(tontines[0]);
          }
        }}
      />
      
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Historique des Transactions</h1>
          </div>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={tontines.length === 0}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-2xl transition-all shadow-lg disabled:cursor-not-allowed"
            title={tontines.length === 0 ? "Vous devez rejoindre une tontine d'abord" : "Déclarer un paiement"}
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
          ) : payments.length > 0 ? (
            <>
              {payments.map((p) => {
                const status = getStatusInfo(p.status);
                return (
                  <div key={p._id} className={`bg-white rounded-3xl p-5 border ${status.border} shadow-sm space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`${status.bg} ${status.color} p-3 rounded-2xl`}>
                          <status.icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 leading-tight">{p.tontine?.nom}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{p.amount.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                        <p className={`text-[9px] font-black uppercase ${status.color}`}>{status.label}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
                          <div>
                              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Méthode</p>
                              <p className="text-xs font-bold text-gray-700 capitalize">{p.method}</p>
                          </div>
                          <div>
                              <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Référence</p>
                              <p className="text-xs font-mono font-bold text-gray-700">{p.reference}</p>
                          </div>
                      </div>

                      {p.status === 'approved' && p.receiptId && (
                          <button 
                              onClick={() => handleDownloadReceipt(p._id, p.receiptId)}
                              className="bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary-700 transition-all"
                          >
                              <Download size={16} />
                              REÇU PDF
                          </button>
                      )}

                      {p.status === 'rejected' && p.rejectionReason && (
                          <div className="flex items-center gap-2 text-red-500 bg-red-50/50 px-3 py-2 rounded-xl border border-red-50">
                              <AlertCircle size={14} />
                              <p className="text-[10px] font-bold">{p.rejectionReason}</p>
                          </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-black text-gray-600">Page {page} sur {totalPages}</span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-gray-100 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Aucune transaction enregistrée</h3>
                  <p className="text-gray-500 font-medium italic mb-2">Déclarez votre premier paiement pour participer à la tontine</p>
                </div>
                {tontines.length > 0 ? (
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Plus size={18} />
                    Déclarer un paiement
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Vous devez d'abord rejoindre une tontine</p>
                    <Link 
                      to="/tontines" 
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 shadow-lg transition-all"
                    >
                      <ArrowRight size={18} />
                      Rejoindre une tontine
                    </Link>
                  </div>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payments;
