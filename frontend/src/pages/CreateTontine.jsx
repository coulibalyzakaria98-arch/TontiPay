import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, PlusCircle, Calendar, Users, DollarSign, Clock, Loader2 } from 'lucide-react';

const CreateTontine = () => {
  const [formData, setFormData] = useState({
    nom: '',
    montant: '',
    frequence: 'mensuelle',
    nombreMembres: '',
    dateDebut: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/tontines', formData);
      navigate(`/tontines/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <PlusCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Nouvelle Tontine</h1>
                <p className="text-indigo-100 text-sm">Définissez les règles de votre groupe d'épargne.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nom de la tontine</label>
              <input
                name="nom"
                type="text"
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="Ex: Famille, Amis de la fac..."
                value={formData.nom}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" /> Montant cotisation (FCFA)
                </label>
                <input
                  name="montant"
                  type="number"
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="5000"
                  value={formData.montant}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Users className="w-3 h-3 mr-1" /> Nombre de membres
                </label>
                <input
                  name="nombreMembres"
                  type="number"
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="10"
                  value={formData.nombreMembres}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Fréquence
                </label>
                <select
                  name="frequence"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none appearance-none"
                  value={formData.frequence}
                  onChange={handleChange}
                >
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuelle">Mensuelle</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> Date de début
                </label>
                <input
                  name="dateDebut"
                  type="date"
                  required
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  value={formData.dateDebut}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Lancer la tontine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTontine;
