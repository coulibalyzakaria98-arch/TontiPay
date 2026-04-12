import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Users, 
  Calendar, 
  Banknote, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  Loader2,
  XCircle,
  Download
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const TontineDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      const [tontineRes, paymentsRes] = await Promise.all([
        api.get(`/tontines/${id}`),
        api.get(`/payments/tontine/${id}`)
      ]);
      setData(tontineRes.data.data);
      setPayments(paymentsRes.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des détails", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleValidate = async (paymentId) => {
    setActionLoading(paymentId);
    try {
      await api.patch(`/payments/${paymentId}/validate`, { status: 'approved' });
      await fetchDetails();
    } catch (error) {
      alert("Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (paymentId) => {
    const reason = window.prompt("Motif du rejet (obligatoire) :");
    if (!reason) return;

    setActionLoading(paymentId);
    try {
      await api.patch(`/payments/${paymentId}/validate`, { status: 'rejected', reason });
      await fetchDetails();
    } catch (error) {
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (paymentId, receiptId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://tontipay.onrender.com/api'}/payments/${paymentId}/receipt`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Recu-${receiptId}.pdf`;
        a.click();
      }
    } catch (err) {
      alert("Erreur de téléchargement");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={40} /></div>;

  const { tontine, members } = data;
  const isAdmin = tontine.createur._id === user?._id;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        tontine={tontine}
        onSuccess={fetchDetails}
      />

      <header className="bg-white border-b sticky top-0 z-20 px-4 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center">
            <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-primary-600">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="ml-2 text-xl font-bold text-gray-900">{tontine.nom}</h1>
          </div>
          <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold uppercase">{tontine.statut}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Card Info */}
        <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-primary-100 text-xs font-medium uppercase">Cotisation</p>
              <p className="text-3xl font-bold">{tontine.montant.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase mb-1">Code</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-black tracking-widest">{tontine.code}</code>
                <button onClick={() => { navigator.clipboard.writeText(tontine.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <div className="flex items-center gap-1"><Clock size={16}/> {tontine.frequence}</div>
            <div className="flex items-center gap-1"><Users size={16}/> {members.length}/{tontine.nombreMembres} membres</div>
          </div>
        </div>

        {/* Action Button for Members */}
        {!isAdmin && tontine.statut === 'en cours' && (
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full bg-white border-2 border-primary-500 text-primary-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-50 transition-all"
          >
            <PlusCircle size={20} />
            Déclarer ma cotisation du tour
          </button>
        )}

        {/* Admin Validation Section */}
        {isAdmin && payments.some(p => p.status === 'pending') && (
          <section className="space-y-4">
            <h2 className="text-lg font-black text-orange-600 flex items-center gap-2">
              <AlertCircle size={20} /> Paiements à valider
            </h2>
            <div className="space-y-3">
              {payments.filter(p => p.status === 'pending').map(p => (
                <div key={p._id} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-gray-900">{p.user.prenom} {p.user.nom}</p>
                    <p className="text-xs text-orange-700 font-mono">Réf: {p.reference} • {p.method}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(p._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors">
                      <XCircle size={24} />
                    </button>
                    <button onClick={() => handleValidate(p._id)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">
                      VALIDER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Payments History */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Historique des transactions</h2>
          <div className="space-y-3">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${p.status === 'approved' ? 'bg-green-50 text-green-600' : p.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                      {p.status === 'approved' ? <CheckCircle2 size={20}/> : <Clock size={20}/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.user.prenom} {p.user.nom}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{new Date(p.createdAt).toLocaleDateString()} • {p.method}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-900">{p.amount.toLocaleString()} F</p>
                      <p className={`text-[10px] font-bold ${p.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>{p.status}</p>
                    </div>
                    {p.status === 'approved' && p.receiptId && (
                      <button onClick={() => handleDownload(p._id, p.receiptId)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-10 italic">Aucun paiement pour le moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TontineDetails;
