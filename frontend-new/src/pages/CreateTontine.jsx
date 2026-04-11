import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Layout, 
  Banknote, 
  Calendar, 
  Users, 
  Clock, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import api from '../services/api';

const CreateTontine = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    montant: '',
    frequence: 'mensuelle',
    nombreMembres: '',
    dateDebut: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/tontines', {
        ...formData,
        montant: Number(formData.montant),
        nombreMembres: Number(formData.nombreMembres),
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/'); // Redirection vers le dashboard après 2s
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-green-100">
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tontine Créée !</h1>
          <p className="text-gray-500 mb-6">Votre tontine a été configurée avec succès. Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <header className="bg-white px-4 py-6 border-b sticky top-0 z-20">
        <div className="flex items-center max-w-2xl mx-auto">
          <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-primary-600 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="ml-2 text-xl font-bold text-gray-900">Nouvelle Tontine</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Nom de la tontine */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Layout size={18} className="text-primary-500" />
                Nom de la tontine
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 shadow-sm"
                placeholder="Ex: Tontine Famille, Projet Vacances..."
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Montant */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Banknote size={18} className="text-primary-500" />
                  Cotisation (FCFA)
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 shadow-sm"
                  placeholder="5000"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                />
              </div>

              {/* Fréquence */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock size={18} className="text-primary-500" />
                  Fréquence
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none text-gray-900 shadow-sm"
                  value={formData.frequence}
                  onChange={(e) => setFormData({ ...formData, frequence: e.target.value })}
                >
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuelle">Mensuelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de membres */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Users size={18} className="text-primary-500" />
                  Nombre de membres
                </label>
                <input
                  type="number"
                  required
                  min="2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 shadow-sm"
                  placeholder="12"
                  value={formData.nombreMembres}
                  onChange={(e) => setFormData({ ...formData, nombreMembres: e.target.value })}
                />
              </div>

              {/* Date de début */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={18} className="text-primary-500" />
                  Date de début
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 shadow-sm"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <span>Lancer la tontine</span>
                )}
              </button>
            </div>

          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg h-fit">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-blue-900 font-bold text-sm">Bon à savoir</h3>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
              Une fois créée, vous recevrez un code unique à partager avec vos proches pour qu'ils puissent rejoindre la tontine.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTontine;
