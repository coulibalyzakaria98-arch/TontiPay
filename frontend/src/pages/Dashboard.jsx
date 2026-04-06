import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, LogIn, Users, Bell, History, ShieldCheck, Landmark, Calendar, Loader2 } from 'lucide-react';
import AdminStats from '../components/AdminStats';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tontines, setTontines] = useState([]);
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
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">TontiPay</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
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
              <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>
              <span className="text-gray-600 hidden md:block text-sm">
                Salut, <span className="font-bold">{user?.prenom}</span>
              </span>
              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Sortir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Admin Stats Header */}
        {user?.role === 'admin' && <AdminStats />}

        {/* User Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Mes Tontines</h2>
              <p className="text-2xl font-black">{tontines.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-xl">
              <Landmark className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Total Épargné</h2>
              <p className="text-2xl font-black">-- FCFA</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Prochain Tour</h2>
              <p className="text-2xl font-black">À venir</p>
            </div>
          </div>
        </div>

        {/* Actions & Tontines List */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Tontines</h1>
            <p className="text-gray-500 mt-1">Vos groupes d'épargne collective.</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/rejoindre"
              className="flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              <LogIn className="w-4 h-4 mr-2 text-gray-500" />
              Rejoindre
            </Link>
            <Link
              to="/creer"
              className="flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Créer
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
          </div>
        ) : tontines.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tontines.map((tontine) => (
              <Link
                key={tontine._id}
                to={`/tontines/${tontine._id}`}
                className="group block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 text-[10px] rounded-full font-black tracking-widest uppercase ${
                    tontine.statut === 'en attente' ? 'bg-yellow-100 text-yellow-700' : 
                    tontine.statut === 'en cours' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tontine.statut}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{tontine.nom}</h3>
                <p className="text-gray-500 text-sm mb-6 flex items-center">
                  <span className="capitalize">{tontine.frequence}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span>{tontine.nombreMembres} membres</span>
                </p>
                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                  <span className="text-indigo-600 text-lg font-black">
                    {tontine.montant.toLocaleString()} FCFA
                  </span>
                  <span className="text-gray-400 text-[10px] font-mono font-bold bg-gray-50 px-2 py-1 rounded">
                    CODE: {tontine.code}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 py-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aucune tontine active</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">
              Commencez votre épargne collective dès maintenant !
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/rejoindre" className="text-indigo-600 font-bold hover:underline text-sm">
                Rejoindre via un code
              </Link>
              <span className="text-gray-200">|</span>
              <Link to="/creer" className="text-indigo-600 font-bold hover:underline text-sm">
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
