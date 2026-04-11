import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  ArrowUpRight, 
  Calendar, 
  PlusCircle, 
  ChevronRight,
  Hash,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import JoinTontineModal from '../components/JoinTontineModal';

const Dashboard = () => {
  const [tontines, setTontines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchTontines = async () => {
      try {
        const response = await api.get('/tontines/my-tontines');
        setTontines(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tontines", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTontines();
  }, []);

  const stats = [
    { label: 'Total Versé', value: '--- FCFA', icon: Wallet, color: 'text-blue-600' },
    { label: 'Prochain Tour', value: 'À venir', icon: Calendar, color: 'text-orange-600' },
    { label: 'Mes Tontines', value: `${tontines.length} Active(s)`, icon: Users, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      <JoinTontineModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      
      {/* Header */}
      <header className="bg-white px-4 py-6 md:py-8 sticky top-0 z-10 md:static">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Tableau de bord</h1>
            <p className="text-sm text-gray-500">Gérez vos épargnes collectives</p>
          </div>
          <Link to="/tontines/create" className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 shadow-lg transition-transform hover:scale-105">
            <PlusCircle size={24} />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-8 mt-4">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Join Action */}
        <button 
          onClick={() => setIsJoinModalOpen(true)}
          className="w-full bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
        >
          <div className="bg-primary-50 text-primary-600 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Hash size={24} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900">Vous avez un code ?</h3>
            <p className="text-sm text-gray-500">Rejoignez une tontine existante instantanément</p>
          </div>
        </button>

        {/* Mes Tontines List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Mes Tontines <ArrowUpRight size={20} className="text-gray-400" />
            </h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : tontines.length > 0 ? (
              tontines.map((t) => (
                <Link 
                  key={t._id} 
                  to={`/tontines/${t._id}`}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group cursor-pointer hover:border-primary-200 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                      {t.nom.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.nom}</h3>
                      <p className="text-sm text-gray-500">{t.nombreMembres} membres • {t.montant} FCFA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">{t.statut}</span>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-200">
                <p className="text-gray-500">Vous ne participez à aucune tontine.</p>
                <Link to="/tontines/create" className="text-primary-600 font-bold hover:underline mt-2 inline-block">
                  Créer la vôtre maintenant
                </Link>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
