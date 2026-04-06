import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Wallet } from 'lucide-react';

const TontineDetails = () => {
  const { id } = useParams();
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

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const { tontine, members } = data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{tontine.nom}</h2>
            <p className="text-indigo-100 uppercase tracking-wider text-xs font-semibold">
              Code d'invitation: <span className="text-white select-all">{tontine.code}</span>
            </p>
          </div>
          <Link
            to={`/tontines/${tontine._id}/payer`}
            className="flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Je paie
          </Link>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b">
          <div>
            <p className="text-sm text-gray-500">Montant cotisation</p>
            <p className="text-lg font-bold">{tontine.montant.toLocaleString()} FCFA</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fréquence</p>
            <p className="text-lg font-bold capitalize">{tontine.frequence}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="text-lg font-bold">
              {new Date(tontine.dateDebut).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Membres ({members.length}/{tontine.nombreMembres})</h3>
            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
              tontine.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
              tontine.statut === 'en cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {tontine.statut.toUpperCase()}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {member.userId.prenom} {member.userId.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.userId.telephone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.aRecu ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">A reçu</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">En attente</span>
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
