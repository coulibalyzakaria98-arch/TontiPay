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
  XCircle
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
      await api.put(`/payments/${paymentId}/validate`);
      await fetchDetails();
    } catch (error) {
      alert("Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (paymentId) => {
    if (!window.confirm("Voulez-vous vraiment rejeter ce paiement ?")) return;
    setActionLoading(paymentId);
    try {
      await api.put(`/payments/${paymentId}/reject`);
      await fetchDetails();
    } catch (error) {
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(data.tontine.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

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
      {/* ... header ... */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center">
            <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-primary-600">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="ml-2 text-xl font-bold text-gray-900 truncate max-w-[200px] md:max-w-none">
              {tontine.nom}
            </h1>
          </div>
          <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {tontine.statut}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
        {/* ... Info Card ... */}
        <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Banknote size={24} />
                </div>
                <div>
                  <p className="text-primary-100 text-xs font-medium uppercase tracking-wider">Cotisation</p>
                  <p className="text-2xl font-bold">{tontine.montant.toLocaleString()} FCFA</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary-200" />
                  <span className="text-sm font-medium capitalize">{tontine.frequence}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary-200" />
                  <span className="text-sm font-medium">{members.length}/{tontine.nombreMembres} membres</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-primary-100 text-[10px] font-bold uppercase mb-2">Code de partage</p>
              <div className="flex items-center gap-3">
                <code className="text-xl font-black tracking-widest">{tontine.code}</code>
                <button 
                  onClick={copyCode}
                  className="bg-white text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 px-1">
            <Users size={20} className="text-gray-400" /> Membres & Ordre
          </h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
            {members.map((m) => (
              <div key={m._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 border-2 border-white shadow-sm">
                    {m.position}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{m.userId.prenom} {m.userId.nom}</p>
                    <p className="text-xs text-gray-500">{m.userId.telephone}</p>
                  </div>
                </div>
                {m.userId._id === tontine.createur._id && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Payments History */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" /> Historique
            </h2>
          </div>
          
          <div className="space-y-3">
            {payments.length > 0 ? (
              payments.map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${
                        p.statut === 'validated' ? 'bg-green-50 text-green-600' : 
                        p.statut === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.statut === 'validated' ? <CheckCircle2 size={24} /> : 
                         p.statut === 'pending' ? <Clock size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{p.user.prenom} {p.user.nom}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(p.datePaiement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} • {p.moyenPaiement}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">+{p.montant.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold uppercase ${
                        p.statut === 'validated' ? 'text-green-600' : 
                        p.statut === 'pending' ? 'text-amber-600' : 'text-red-600'
                      }`}>{p.statut}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Référence</p>
                      <p className="text-xs font-mono text-gray-600">{p.reference}</p>
                    </div>
                    
                    {isAdmin && p.statut === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          disabled={actionLoading === p._id}
                          onClick={() => handleReject(p._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          disabled={actionLoading === p._id}
                          onClick={() => handleValidate(p._id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          {actionLoading === p._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">Aucun paiement enregistré pour le moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 md:pl-64 z-30">
        <button 
          onClick={() => setIsPaymentModalOpen(true)}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-primary-700 transition-all flex items-center gap-3 transform hover:scale-105 active:scale-95 w-full max-w-sm"
        >
          <PlusCircle size={24} />
          <span>Déclarer un paiement</span>
        </button>
      </div>
    </div>
  );
};

export default TontineDetails;

export default TontineDetails;
