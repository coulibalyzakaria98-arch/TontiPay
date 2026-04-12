import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/my-payments');
      setPayments(response.data.data);
    } catch (error) {
      console.error("Erreur chargement paiements", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (paymentId, receiptId) => {
    try {
      // On ouvre le lien dans un nouvel onglet pour le téléchargement
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL || 'https://tontipay.onrender.com/api'}/payments/${paymentId}/receipt`;
      
      // On utilise fetch pour passer le token d'auth
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        alert("Erreur lors du téléchargement du reçu.");
      }
    } catch (error) {
      console.error("Erreur téléchargement", error);
      alert("Impossible de télécharger le reçu.");
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.statut === filter;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { 
            icon: CheckCircle2, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            label: 'Validé',
            border: 'border-emerald-100'
        };
      case 'rejected':
        return { 
            icon: XCircle, 
            color: 'text-red-600', 
            bg: 'bg-red-50', 
            label: 'Rejeté',
            border: 'border-red-100'
        };
      default:
        return { 
            icon: Clock, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50', 
            label: 'En attente',
            border: 'border-amber-100'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Historique des Paiements</h1>
          </div>
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {payments.length}
            </span>
            <FileText className="text-gray-300" size={24} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'approved', label: 'Validés' },
            { id: 'pending', label: 'En attente' },
            { id: 'rejected', label: 'Rejetés' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === item.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-primary-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-primary-500" size={40} />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Chargement des transactions...</p>
            </div>
          ) : filteredPayments.length > 0 ? (
            filteredPayments.map((p) => {
              const status = getStatusInfo(p.statut);
              return (
                <div key={p._id} className={`bg-white rounded-3xl p-5 border ${status.border} shadow-sm space-y-4 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`${status.bg} ${status.color} p-3 rounded-2xl`}>
                        <status.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-tight">{p.tontine?.nom || 'Tontine supprimée'}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(p.datePaiement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">+{p.montant.toLocaleString()} <span className="text-[10px] text-gray-400">FCFA</span></p>
                      <p className={`text-[9px] font-black uppercase tracking-tighter ${status.color}`}>
                        {status.label}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Méthode</p>
                            <p className="text-xs font-bold text-gray-700">{p.moyenPaiement}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Référence</p>
                            <p className="text-xs font-mono font-bold text-gray-700">{p.reference}</p>
                        </div>
                    </div>

                    {p.statut === 'approved' && p.receiptId && (
                        <button 
                            onClick={() => handleDownloadReceipt(p._id, p.receiptId)}
                            className="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary-600 hover:text-white transition-all group"
                        >
                            <Download size={16} className="group-hover:animate-bounce" />
                            REÇU PDF
                        </button>
                    )}

                    {p.statut === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50/50 px-3 py-2 rounded-xl border border-red-50">
                            <AlertCircle size={14} />
                            <p className="text-[10px] font-bold italic">{p.reason || 'Données invalides'}</p>
                        </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="text-gray-300" size={32} />
                </div>
                <p className="text-gray-500 font-medium italic">Aucun paiement trouvé pour ce filtre.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payments;
