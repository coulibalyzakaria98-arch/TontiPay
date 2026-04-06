import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JoinTontine = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tontines/join', { code });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Rejoindre une Tontine</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-6 text-center">
          Saisissez le code d'invitation pour rejoindre une tontine existante.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Code d'invitation</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-mono tracking-widest uppercase"
              placeholder="Ex: 5X2Y9Z"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Traitement...' : 'Rejoindre'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinTontine;
