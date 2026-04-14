import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlusCircle, 
  Calendar, 
  Users, 
  Banknote, 
  Clock, 
  Loader2,
  Dice5,
  UserPlus
} from 'lucide-react';
import api from '../services/api';

const CreateTontine = () => {
  const [formData, setFormData] = useState({
    nom: '',
    montant: '',
    frequence: 'mensuelle',
    nombreMembres: '',
    dateDebut: '',
    typeTirage: 'aleatoire'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      montant: Number(formData.montant),
      nombreMembres: Number(formData.nombreMembres)
    };

    try {
      const res = await api.post('/tontines', payload);
      if (res.data.success) {
        navigate(`/tontines/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Nouvelle Tontine</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {/* Section 1: Identité */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary-50 text-primary-600 p-2 rounded-xl">
                    <PlusCircle size={20} />
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Informations de base</h2>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de la tontine</label>
              <input 
                type="text" 
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Tontine Famille ou Épargne Vacances"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Montant Cotisation (FCFA)</label>
                    <div className="relative">
                        <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="number" 
                            name="montant"
                            required
                            value={formData.montant}
                            onChange={handleChange}
                            placeholder="5000"
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de membres</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="number" 
                            name="nombreMembres"
                            required
                            value={formData.nombreMembres}
                            onChange={handleChange}
                            placeholder="10"
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Section 2: Logistique */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-xl">
                    <Calendar size={20} />
                </div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Paramètres & Fréquence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fréquence</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                            name="frequence"
                            value={formData.frequence}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                        >
                            <option value="hebdomadaire">Hebdomadaire</option>
                            <option value="mensuelle">Mensuelle</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date de début</label>
                    <input 
                        type="date" 
                        name="dateDebut"
                        required
                        value={formData.dateDebut}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>
            </div>

            {/* NEW: Type de Tirage */}
            <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de Tirage au sort</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, typeTirage: 'aleatoire'})}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                            formData.typeTirage === 'aleatoire' 
                            ? 'border-primary-500 bg-primary-50 text-primary-700' 
                            : 'border-gray-100 bg-gray-50 text-gray-400 grayscale'
                        }`}
                    >
                        <Dice5 size={24} />
                        <span className="text-xs font-black uppercase">Hasard pur</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, typeTirage: 'ordre_arrivee'})}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                            formData.typeTirage === 'ordre_arrivee' 
                            ? 'border-primary-500 bg-primary-50 text-primary-700' 
                            : 'border-gray-100 bg-gray-50 text-gray-400 grayscale'
                        }`}
                    >
                        <UserPlus size={24} />
                        <span className="text-xs font-black uppercase">Ordre d'arrivée</span>
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 italic px-1">
                    {formData.typeTirage === 'aleatoire' 
                        ? "🎲 Les positions seront attribuées de manière aléatoire une fois la tontine complète." 
                        : "⏳ Le premier inscrit sera le premier à recevoir le pot."}
                </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
            Créer la tontine
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateTontine;
