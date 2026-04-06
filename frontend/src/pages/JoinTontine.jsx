import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, LogIn, Key, Loader2 } from 'lucide-react';

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
      setError(err.response?.data?.error || 'Code invalide ou tontine complète');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 text-center">
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Key className="w-10 h-10 text-indigo-600" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2">Rejoindre un groupe</h2>
          <p className="text-gray-500 mb-8">Saisissez le code d'invitation à 6 caractères.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm text-left">
                {error}
              </div>
            )}
            
            <input
              type="text"
              required
              maxLength={6}
              className="block w-full text-center py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all outline-none text-3xl font-black tracking-[0.5em] uppercase placeholder:text-gray-200"
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Rejoindre la tontine
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinTontine;
