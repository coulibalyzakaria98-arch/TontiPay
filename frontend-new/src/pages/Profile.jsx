import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  LogOut, 
  Save, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/updatedetails', profileData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      // Optionnel : re-fetch user info ou rafraîchir la page
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Erreur lors du changement de mot de passe.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mon Profil</h1>
            <p className="text-sm text-gray-500 font-medium">Gérez vos informations et votre sécurité</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-8">
        
        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-50 text-primary-600 p-2 rounded-xl">
              <User size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Informations Personnelles</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={profileData.prenom}
                  onChange={(e) => setProfileData({...profileData, prenom: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Votre prénom"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={profileData.nom}
                  onChange={(e) => setProfileData({...profileData, nom: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="XX XX XX XX"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </section>

        {/* Security Card */}
        <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-50 text-orange-600 p-2 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Sécurité & Mot de passe</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
              <input 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                Changer le mot de passe
              </button>
            </div>
          </form>
        </section>

        <div className="text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Membre depuis : {new Date(user?.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
