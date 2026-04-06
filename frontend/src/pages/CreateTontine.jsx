import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Créer une Tontine</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de la tontine</label>
          <input
            name="nom"
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.nom}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Montant cotisation (FCFA)</label>
            <input
              name="montant"
              type="number"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.montant}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de membres</label>
            <input
              name="nombreMembres"
              type="number"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.nombreMembres}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fréquence</label>
            <select
              name="frequence"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.frequence}
              onChange={handleChange}
            >
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuelle">Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de début</label>
            <input
              name="dateDebut"
              type="date"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.dateDebut}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Création...' : 'Créer la tontine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTontine;
