import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Landmark, Clock, Activity, TrendingUp } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse flex space-x-4 p-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div></div></div>;

  if (!stats) return null;

  const statCards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Cotisé', value: `${stats.totalMontant.toLocaleString()} FCFA`, icon: Landmark, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Paiements en attente', value: stats.pendingPayments, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Tontines actives', value: stats.activeTontines, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`${stat.bg} p-3 rounded-xl`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
