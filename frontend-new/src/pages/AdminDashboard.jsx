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
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tontines, setTontines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'tontines' | 'stats'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, tontinesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/tontines')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setTontines(tontinesRes.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des données admin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (!window.confirm(`Voulez-vous vraiment ${newStatus === 'blocked' ? 'bloquer' : 'débloquer'} cet utilisateur ?`)) return;

    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDeleteTontine = async (tontineId) => {
    if (!window.confirm("Action irréversible ! Supprimer cette tontine et toutes ses données (membres, paiements) ?")) return;

    try {
      await api.delete(`/admin/tontines/${tontineId}`);
      setTontines(tontines.filter(t => t._id !== tontineId));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
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
              <Shield className="text-primary-600" /> Administration
            </h1>
            <p className="text-gray-500 text-sm">Gestion globale de la plateforme TontiPay</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Stats Quick View */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Utilisateurs</p>
            <p className="text-2xl font-bold">{stats?.userCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-50 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tontines Actives</p>
            <p className="text-2xl font-bold">{stats?.activeTontines} / {stats?.tontineCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Wallet size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Volume Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalVolume.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-primary-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Shield size={20} />
            </div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Mode</p>
            <p className="text-2xl font-bold">Super Admin</p>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('tontines')}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'tontines' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Tontines
          </button>
        </div>

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center font-bold text-primary-600">
                            {u.prenom[0]}{u.nom[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{u.prenom} {u.nom}</p>
                            <p className="text-xs text-gray-500">Inscrit le {new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{u.email}</p>
                        <p className="text-xs text-gray-500">{u.telephone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          disabled={u.role === 'admin'}
                          className={`p-2 rounded-lg transition-colors ${u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} disabled:opacity-30`}
                          title={u.status === 'active' ? 'Bloquer' : 'Débloquer'}
                        >
                          {u.status === 'active' ? <UserMinus size={18} /> : <UserCheck size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tontines Management */}
        {activeTab === 'tontines' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Tontine</th>
                    <th className="px-6 py-4">Créateur</th>
                    <th className="px-6 py-4">Configuration</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tontines.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{t.nom}</td>
                      <td className="px-6 py-4 text-sm">
                        {t.createur.prenom} {t.createur.nom}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {t.montant.toLocaleString()} FCFA • {t.nombreMembres} membres • {t.frequence}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          t.statut === 'en cours' ? 'bg-green-100 text-green-700' : 
                          t.statut === 'en attente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {t.statut.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteTontine(t._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
