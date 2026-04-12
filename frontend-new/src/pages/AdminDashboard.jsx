import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  Shield, 
  UserMinus, 
  UserCheck, 
  Trash2, 
  TrendingUp,
  Loader2,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tontines, setTontines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'tontines' | 'payments'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, tontinesRes, paymentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/tontines'),
        api.get('/payments') // This endpoint is already admin-protected in backend
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setTontines(tontinesRes.data.data);
      setPayments(paymentsRes.data.data);
    } catch (err) {
      console.error("Erreur lors du chargement des données admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (!window.confirm(`Voulez-vous vraiment ${newStatus === 'blocked' ? 'bloquer' : 'débloquer'} cet utilisateur ?`)) return;

    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    if (!window.confirm(`Voulez-vous vraiment passer cet utilisateur en rôle ${newRole.toUpperCase()} ?`)) return;

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert("Erreur lors du changement de rôle");
    }
  };

  const handleDeleteTontine = async (tontineId) => {
    if (!window.confirm("Action irréversible ! Supprimer cette tontine et toutes ses données ?")) return;

    try {
      await api.delete(`/admin/tontines/${tontineId}`);
      setTontines(tontines.filter(t => t._id !== tontineId));
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleValidatePayment = async (paymentId) => {
    try {
      await api.put(`/payments/${paymentId}/validate`);
      fetchData(); // Refresh all data
    } catch {
      alert("Erreur lors de la validation");
    }
  };

  const handleRejectPayment = async (paymentId) => {
    if (!window.confirm("Refuser ce paiement ?")) return;
    try {
      await api.put(`/payments/${paymentId}/reject`);
      fetchData(); // Refresh all data
    } catch {
      alert("Erreur lors du rejet");
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-primary-600" size={28} /> Administration
            </h1>
            <p className="text-gray-500 text-sm">Gestion globale de la plateforme TontiPay</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="Rafraîchir les données"
          >
            <Loader2 size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Stats View */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-primary-200 transition-all">
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Utilisateurs</p>
            <p className="text-3xl font-black text-gray-900">{stats?.userCount}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-primary-200 transition-all">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Tontines Actives</p>
            <p className="text-3xl font-black text-gray-900">{stats?.activeTontines} <span className="text-sm text-gray-300 font-normal">/ {stats?.tontineCount}</span></p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-primary-200 transition-all">
            <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Flux Total</p>
            <p className="text-3xl font-black text-gray-900">{stats?.totalVolume.toLocaleString()}</p>
          </div>
          <div className="bg-primary-600 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <Shield size={80} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
            <div className="relative z-10">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Statut Système</p>
              <p className="text-3xl font-black mt-1">Opérationnel</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <span className="text-[10px] font-bold">Services Live</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'tontines', label: 'Tontines', icon: TrendingUp },
            { id: 'payments', label: 'Transactions', icon: CreditCard }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-5">Identité</th>
                    <th className="px-6 py-5">Contact & Rôle</th>
                    <th className="px-6 py-5">Statut Compte</th>
                    <th className="px-6 py-5 text-right">Contrôles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center font-bold text-primary-600 border border-primary-100 shadow-sm">
                            {u.prenom[0]}{u.nom[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{u.prenom} {u.nom}</p>
                            <p className="text-[10px] text-gray-400 font-medium italic">Inscrit le {new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                            {u.role.toUpperCase()}
                          </span>
                          <p className="text-[10px] text-gray-400 font-medium">{u.telephone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${
                          u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateRole(u._id, u.role)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                            title="Changer de rôle"
                          >
                            <Shield size={18} />
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(u._id, u.status)}
                            disabled={u.role === 'admin'}
                            className={`p-2 rounded-xl transition-colors ${u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} disabled:opacity-20`}
                            title={u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                          >
                            {u.status === 'active' ? <UserMinus size={18} /> : <UserCheck size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TONTINES TAB */}
          {activeTab === 'tontines' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-5">Tontine</th>
                    <th className="px-6 py-5">Administrateur</th>
                    <th className="px-6 py-5">Configuration</th>
                    <th className="px-6 py-5">Statut</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tontines.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{t.nom}</p>
                        <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-black text-gray-500 uppercase tracking-tighter">{t.code}</code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700">{t.createur.prenom} {t.createur.nom}</p>
                        <p className="text-[10px] text-gray-400 font-medium italic">{t.createur.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900">{t.montant.toLocaleString()} FCFA</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{t.nombreMembres} membres • {t.frequence}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${
                          t.statut === 'en cours' ? 'bg-green-100 text-green-700' : 
                          t.statut === 'en attente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {t.statut.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteTontine(t._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Supprimer la tontine"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-5">Contributeur</th>
                    <th className="px-6 py-5">Tontine</th>
                    <th className="px-6 py-5">Détails Paiement</th>
                    <th className="px-6 py-5">Statut</th>
                    <th className="px-6 py-5 text-right">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                            {p.user.prenom[0]}{p.user.nom[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{p.user.prenom} {p.user.nom}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{p.user.telephone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-primary-600">{p.tontine.nom}</p>
                        <p className="text-[10px] text-gray-400 font-medium italic">Tour n°{p.tour}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-gray-900">+{p.montant.toLocaleString()} FCFA</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{p.moyenPaiement}</span>
                            <span className="text-[10px] font-mono text-gray-300">Ref: {p.reference}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${
                          p.statut === 'validated' ? 'bg-green-100 text-green-700' : 
                          p.statut === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.statut === 'pending' && <Clock size={10} className="animate-spin" />}
                          {p.statut.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.statut === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleRejectPayment(p._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Rejeter"
                            >
                              <XCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleValidatePayment(p._id)}
                              className="bg-green-600 text-white p-2 rounded-xl shadow-lg hover:bg-green-700 transition-all transform active:scale-95"
                              title="Valider"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-300 italic font-medium">Traité le {new Date(p.dateValidation || p.datePaiement).toLocaleDateString()}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
