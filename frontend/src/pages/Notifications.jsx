import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Check, Trash2, ArrowLeft } from 'lucide-react';
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

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement de vos notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div 
              key={n._id} 
              className={`p-4 rounded-xl border transition-all ${
                n.read ? 'bg-white border-gray-100 opacity-75' : 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-3">
                  <div className={`mt-1 p-2 rounded-lg ${
                    n.type.includes('payment') ? 'bg-green-50 text-green-600' :
                    n.type === 'reminder' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <button 
                    onClick={() => handleMarkAsRead(n._id)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
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
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Aucune notification pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
