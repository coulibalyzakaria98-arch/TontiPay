import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTontine from './pages/CreateTontine';
import TontineDetails from './pages/TontineDetails';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 w-full ${!isAuthPage ? 'md:pb-0 pb-20' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tontines/create" element={<CreateTontine />} />
          <Route path="/tontines/:id" element={<TontineDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/tontines" element={<div className="p-8">Page Mes Tontines (Bientôt disponible)</div>} />
          <Route path="/payments" element={<div className="p-8">Page Paiements (Bientôt disponible)</div>} />
          <Route path="/profile" element={<div className="p-8">Page Profil (Bientôt disponible)</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
