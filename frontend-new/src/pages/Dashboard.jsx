import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  PlusCircle, 
  ChevronRight,
  Hash,
  Loader2,
  ArrowRight,
  Target
} from 'lucide-react';
import api from '../services/api';
import JoinTontineModal from '../components/JoinTontineModal';

const Dashboard = () => {
  const [tontines, setTontines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tontinesRes, statsRes] = await Promise.all([
          api.get('/tontines/my-tontines'),
          api.get('/stats/dashboard')
        ]);
        setTontines(tontinesRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsDisplay = [
    { 
      label: 'Total Épargné', 
      value: stats ? `${stats.totalVersé.toLocaleString()} FCFA` : '0 FCFA', 
      icon: Wallet, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Prochain Pot', 
      value: stats?.upcomingPayouts?.length > 0 
        ? `${stats.upcomingPayouts[0].montantPot.toLocaleString()} FCFA` 
        : '--- FCFA', 
      icon: TrendingUp, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Tontines Actives', 
      value: stats ? `${stats.activeTontinesCount} Active(s)` : '0', 
      icon: Users, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      <JoinTontineModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      
      {/* Header Mobile Optimizied */}
      <header className="bg-white px-6 py-8 border-b border-gray-100">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl tracking-tight">Bonjour ! 👋</h1>
            <p className="text-sm text-gray-500 font-medium">Voici l'état de vos finances aujourd'hui.</p>
          </div>
          <Link to="/tontines/create" className="bg-primary-600 text-white p-3 rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95">
            <PlusCircle size={24} />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsDisplay.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
              <div className={`${stat.bgColor} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Upcoming Payouts - NEW SECTION */}
        {stats?.upcomingPayouts?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-black flex items-center gap-2 px-1 text-gray-800 uppercase tracking-tight">
              🎯 Prochains Gains <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-2">Objectifs</span>
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
              {stats.upcomingPayouts.map((payout, idx) => (
                <div key={idx} className="min-w-[280px] bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex-shrink-0 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">{payout.tontineNom}</p>
                  <h3 className="text-2xl font-black mb-4">+{payout.montantPot.toLocaleString()} <span className="text-sm font-normal text-indigo-200">FCFA</span></h3>
                  <div className="flex items-center justify-between text-xs font-bold bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <span className="text-indigo-100">Position: {payout.position}</span>
                    <span className={payout.estProchain ? 'text-orange-300 animate-pulse' : 'text-indigo-200'}>
                      {payout.estProchain ? 'Bientôt votre tour !' : `Dans ${payout.position - payout.tourActuel} tour(s)`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 flex items-center space-x-4 hover:border-primary-400 hover:bg-primary-50/30 transition-all group text-left"
            >
                <div className="bg-primary-50 text-primary-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <Hash size={24} />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 tracking-tight">Rejoindre une tontine</h3>
                    <p className="text-xs text-gray-500 font-medium">Entrez un code pour participer</p>
                </div>
            </button>
            <Link 
                to="/payments"
                className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center space-x-4 hover:shadow-lg transition-all group text-left shadow-sm"
            >
                <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <Wallet size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-black text-gray-900 tracking-tight">Historique des paiements</h3>
                    <p className="text-xs text-gray-500 font-medium">Voir vos reçus et transactions</p>
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-primary-500 transition-colors" size={20} />
            </Link>
        </div>

        {/* Mes Tontines List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Mes Tontines</h2>
            <Link to="/tontines" className="text-xs font-bold text-primary-600 hover:underline">Voir tout</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tontines.length > 0 ? (
              tontines.map((t) => (
                <Link 
                  key={t._id} 
                  to={`/tontines/${t._id}`}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-black text-lg">
                      {t.nom.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">{t.nom}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {t.montant.toLocaleString()} FCFA • {t.frequence}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            t.statut === 'en cours' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                            {t.statut}
                        </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                        <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="text-gray-300" size={32} />
                </div>
                <p className="text-gray-500 font-medium">Vous ne participez à aucune tontine.</p>
                <Link to="/tontines/create" className="text-primary-600 font-black hover:underline mt-3 inline-block uppercase text-xs tracking-widest">
                  Créer ma première tontine
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
