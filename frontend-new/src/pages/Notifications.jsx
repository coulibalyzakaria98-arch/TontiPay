import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Bell, 
  Trash2, 
  Clock, 
  Loader2,
  BellRing,
  CheckCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Erreur chargement notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Erreur marquage lecture", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erreur marquage global", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error("Erreur suppression", error);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'payment_validated':
        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'payment_rejected':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'your_turn':
        return { icon: BellRing, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'reminder':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' };
      default:
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Notifications</h1>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-xs font-black text-primary-600 flex items-center gap-1 hover:underline uppercase tracking-tighter"
            >
              <CheckCheck size={16} />
              Tout lire
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => {
            const style = getNotificationStyle(n.type);
            return (
              <div 
                key={n._id} 
                onClick={() => !n.read && markAsRead(n._id)}
                className={`relative group bg-white p-5 rounded-3xl border transition-all cursor-pointer ${
                  n.read ? 'border-gray-100 opacity-75' : 'border-primary-100 shadow-sm ring-1 ring-primary-50'
                }`}
              >
                {!n.read && (
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                )}
                
                <div className="flex gap-4">
                  <div className={`${style.bg} ${style.color} p-3 rounded-2xl h-fit`}>
                    <style.icon size={20} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-600' : 'font-bold text-gray-900'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(n.createdAt).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n._id);
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-gray-100 mt-10">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">Votre boîte de réception est vide.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
