import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LayoutDashboard,
  Wallet,
  Users
} from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tontines', icon: Users, label: 'Mes Tontines' },
    { path: '/payments', icon: Wallet, label: 'Paiements' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="p-8">
          <h2 className="text-2xl font-black text-primary-600 tracking-tighter">TontiPay</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                  isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 rounded-t-[32px] shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative p-3 rounded-2xl transition-all ${
                isActive ? 'bg-primary-50 text-primary-600 scale-110' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              {item.badge > 0 && (
                <span className="absolute top-2 right-2 bg-primary-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {item.badge > 9 ? '+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
