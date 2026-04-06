import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Check, ArrowLeft, Loader2, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'payment_validated': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'payment_rejected': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'reminder': return <Bell className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-gray-500 text-sm mt-1">Restez informé de vos activités.</p>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Tout lire
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                className={`group p-5 rounded-2xl border transition-all duration-300 ${
                  n.read 
                    ? 'bg-white/60 border-gray-100 opacity-80' 
                    : 'bg-white border-indigo-100 shadow-md shadow-indigo-100/20 ring-1 ring-indigo-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <div className={`mt-1 p-2.5 rounded-xl ${
                      n.read ? 'bg-gray-50' : 'bg-indigo-50'
                    }`}>
                      {getIcon(n.type)}
                    </div>
                    <div>
                      <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-tighter">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!n.read && (
                    <button 
                      onClick={() => handleMarkAsRead(n._id)}
                      className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Marquer comme lu"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 py-24 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tout est calme</h3>
            <p className="text-gray-500 mt-2 text-sm">Vous n'avez pas encore de notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
