import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Users, 
  Calendar, 
  Banknote, 
  ChevronRight,
  Filter,
  Loader2,
  Trophy,
  Activity,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyTontines = () => {
  const [tontines, setTontines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, en attente, en cours, terminée

  useEffect(() => {
    fetchMyTontines();
  }, []);

  const fetchMyTontines = async () => {
    try {
      const response = await api.get('/tontines/my-tontines');
      setTontines(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des tontines", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTontines = tontines.filter(t => {
    const matchesSearch = t.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'en cours':
        return { 
          icon: Activity, 
          label: 'En cours', 
          color: 'text-emerald-600', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-100' 
        };
      case 'en attente':
        return { 
          icon: Timer, 
          label: 'Recrutement', 
          color: 'text-orange-600', 
          bg: 'bg-orange-50', 
          border: 'border-orange-100' 
        };
      case 'terminée':
        return { 
          icon: Trophy, 
          label: 'Terminée', 
          color: 'text-gray-600', 
          bg: 'bg-gray-100', 
          border: 'border-gray-200' 
        };
      default:
        return { 
          icon: Calendar, 
          label: status, 
          color: 'text-blue-600', 
          bg: 'bg-blue-50', 
          border: 'border-blue-100' 
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mes Tontines</h1>
            </div>
            <Link 
              to="/tontines/create" 
              className="bg-primary-600 text-white px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95"
            >
              <Plus size={18} />
              CRÉER
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une tontine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'Toutes', icon: Filter },
            { id: 'en cours', label: 'En cours', icon: Activity },
            { id: 'en attente', label: 'En attente', icon: Timer },
            { id: 'terminée', label: 'Terminées', icon: Trophy }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === item.id 
                ? 'bg-gray-900 text-white shadow-xl scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-primary-200 shadow-sm'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-primary-500" size={40} />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Chargement de votre épargne...</p>
            </div>
          ) : filteredTontines.length > 0 ? (
            filteredTontines.map((t) => {
              const status = getStatusStyle(t.statut);
              return (
                <Link 
                  key={t._id} 
                  to={`/tontines/${t._id}`}
                  className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl ${status.bg} ${status.color}`}>
                        <status.icon size={24} />
                      </div>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
                        {status.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors truncate">
                        {t.nom}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <Users size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {t.nombreMembres} membres
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Cotisation</p>
                        <p className="font-black text-gray-900">{t.montant.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Fréquence</p>
                        <p className="text-xs font-bold text-gray-700 capitalize">{t.frequence}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Voir les détails</span>
                        <ChevronRight className="text-primary-500" size={18} />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Banknote className="text-gray-300" size={32} />
                </div>
                <h3 className="text-gray-900 font-black tracking-tight mb-2">Aucune tontine trouvée</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">
                    Essayez de modifier vos filtres ou créez-en une nouvelle.
                </p>
                <Link 
                    to="/tontines/create" 
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all"
                >
                    <Plus size={18} />
                    Créer une tontine
                </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTontines;
