import React, { useState } from 'react';
import { X, Hash, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JoinTontineModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/tontines/join', { code: code.toUpperCase() });
      // response.data.data est le membre créé, mais on veut l'ID de la tontine
      const tontineId = response.data.data.tontineId;
      onClose();
      navigate(`/tontines/${tontineId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Code invalide ou tontine complète");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hash size={32} className="text-primary-600" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Rejoindre</h2>
            <p className="text-gray-500 mt-2 text-sm">Saisissez le code unique partagé par l'administrateur.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-0 outline-none transition-all uppercase placeholder:text-gray-200 text-gray-900"
                placeholder="XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && (
                <p className="text-red-500 text-xs mt-3 text-center font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Valider le code</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinTontineModal;
