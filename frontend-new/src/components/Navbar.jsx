import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Bell, LogOut, User } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await api.get('/notifications');
        const count = response.data.data.filter(n => !n.read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navItems = [
    { label: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { label: 'Mes Tontines', path: '/tontines', icon: Users },
    { label: 'Paiements', path: '/payments', icon: CreditCard },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">TontiPay</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 font-bold' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 md:hidden z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 relative ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <item.icon size={20} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
