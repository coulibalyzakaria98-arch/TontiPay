import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Landmark, Clock, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100"></div>
      ))}
    </div>
  );

  if (!stats) return null;

  const statCards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Cotisé', value: `${stats.totalMontant.toLocaleString()} FCFA`, icon: Landmark, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Paiements en attente', value: stats.pendingPayments, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Tontines actives', value: stats.activeTontines, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Évolution des cotisations
            </h3>
            <p className="text-gray-400 text-sm font-medium">Montants validés sur les 6 derniers mois</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontWeight: 'bold'
                }}
                formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Cotisé']}
              />
              <Bar dataKey="montant" radius={[6, 6, 0, 0]} barSize={40}>
                {stats.chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === stats.chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} 
                    className="transition-all hover:fill-indigo-400"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
