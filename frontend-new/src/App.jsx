import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTontine from './pages/CreateTontine';
import TontineDetails from './pages/TontineDetails';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import MyTontines from './pages/MyTontines';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const isNavbarHidden = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isNavbarHidden && <Navbar />}
      <main className={`flex-1 w-full ${!isNavbarHidden ? 'md:pb-0 pb-20' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/tontines/create" element={
            <ProtectedRoute>
              <CreateTontine />
            </ProtectedRoute>
          } />

          <Route path="/tontines" element={
            <ProtectedRoute>
              <MyTontines />
            </ProtectedRoute>
          } />
          
          <Route path="/tontines/:id" element={
            <ProtectedRoute>
              <TontineDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />

          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
