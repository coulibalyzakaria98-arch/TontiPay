import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, LogIn, Users, Bell, History, ShieldCheck } from 'lucide-react';
import AdminStats from '../components/AdminStats';

const Dashboard = () => {
...
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tontinesRes, notificationsRes] = await Promise.all([
          api.get('/tontines/my-tontines'),
          api.get('/notifications')
        ]);
        setTontines(tontinesRes.data.data);
        setUnreadCount(notificationsRes.data.data.filter(n => !n.read).length);
      } catch (err) {
...
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">TontiPay</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/historique" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <History className="w-6 h-6" />
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/payments" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Admin">
                  <ShieldCheck className="w-6 h-6" />
                </Link>
              )}
              <span className="text-gray-600 hidden md:block">
                Salut, <span className="font-semibold">{user?.prenom}</span>
              </span>
...
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {user?.role === 'admin' && <AdminStats />}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Tontines</h1>
            <p className="text-gray-500">Gérez vos épargnes collectives en toute sécurité.</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/rejoindre"
              className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogIn className="w-4 h-4 mr-2 text-gray-500" />
              Rejoindre
            </Link>
            <Link
              to="/creer"
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Créer
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Chargement de vos tontines...</div>
        ) : tontines.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tontines.map((tontine) => (
              <Link
                key={tontine._id}
                to={`/tontines/${tontine._id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    tontine.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                    tontine.statut === 'en cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tontine.statut.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{tontine.nom}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {tontine.frequence.charAt(0).toUpperCase() + tontine.frequence.slice(1)} • {tontine.nombreMembres} membres
                </p>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-indigo-600 font-bold">
                    {tontine.montant.toLocaleString()} FCFA
                  </span>
                  <span className="text-gray-400 text-xs font-mono">CODE: {tontine.code}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucune tontine active</h3>
            <p className="text-gray-500 mt-1 max-w-xs mx-auto">
              Vous n'avez pas encore rejoint de tontine. Commencez par en créer une ou rejoignez celle de vos amis.
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <Link to="/rejoindre" className="text-indigo-600 font-semibold hover:text-indigo-500">
                Rejoindre via un code
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/creer" className="text-indigo-600 font-semibold hover:text-indigo-500">
                Créer la mienne
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
