import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Wallet, Users, Calendar, ArrowLeft, ShieldCheck, CheckCircle, Clock } from 'lucide-react';

const TontineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTontine = async () => {
      try {
        const { data } = await api.get(`/tontines/${id}`);
        setData(data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTontine();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-gray-500 font-bold">Chargement des membres...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="bg-red-50 p-6 rounded-3xl mb-4 text-red-600 font-bold">
        {error}
      </div>
      <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">
        Retourner à l'accueil
      </button>
    </div>
  );

  const { tontine, members } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tableau de bord
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden mb-8">
          <div className="bg-indigo-600 p-8 text-white md:flex justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-black">{tontine.nom}</h1>
              <div className="mt-2 flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest w-fit">
                CODE: {tontine.code}
              </div>
            </div>
            <Link
              to={`/tontines/${tontine._id}/payer`}
              className="flex items-center justify-center bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Je paie ma part
            </Link>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cotisation</p>
                <p className="text-xl font-black">{tontine.montant.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Fréquence</p>
                <p className="text-xl font-black capitalize">{tontine.frequence}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Début</p>
                <p className="text-xl font-black">
                  {new Date(tontine.dateDebut).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center">
              <Users className="w-6 h-6 mr-3 text-indigo-600" />
              Membres ({members.length}/{tontine.nombreMembres})
            </h2>
            <span className={`px-4 py-1.5 text-xs rounded-full font-black uppercase tracking-widest ${
              tontine.statut === 'en attente' ? 'bg-yellow-100 text-yellow-700' : 
              tontine.statut === 'en cours' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800'
            }`}>
              {tontine.statut}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Ordre</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-black text-gray-500">
                        {member.position}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {member.userId.prenom} {member.userId.nom}
                        {member.userId._id === tontine.createur._id && (
                          <ShieldCheck className="w-4 h-4 inline ml-2 text-indigo-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">{member.userId.telephone}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-center">
                      {member.aRecu ? (
                        <div className="inline-flex items-center text-green-600 font-bold text-xs uppercase bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Payé
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-indigo-400 font-bold text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          Attente
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TontineDetails;
