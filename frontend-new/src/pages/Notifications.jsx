import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ChevronLeft,
  Loader2,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erreur", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Erreur", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'payment_validated': return <CheckCircle2 className="text-green-500" size={24} />;
      case 'payment_rejected': return <XCircle className="text-red-500" size={24} />;
      case 'reminder': return <Clock className="text-amber-500" size={24} />;
      default: return <AlertCircle className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllRead}
              className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors"
            >
              Tout marquer lu
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  n.read 
                    ? 'bg-white border-gray-100 opacity-60' 
                    : 'bg-white border-primary-100 shadow-md ring-1 ring-primary-50'
                }`}
              >
                <div className="flex gap-4">
                  <div className="mt-1">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider">
                      {new Date(n.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Bell size={40} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Aucune notification</h2>
            <p className="text-sm text-gray-500 mt-2">Vous êtes à jour ! Vos rappels s'afficheront ici.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
