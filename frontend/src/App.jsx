import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTontine from './pages/CreateTontine';
import JoinTontine from './pages/JoinTontine';
import TontineDetails from './pages/TontineDetails';
import PaymentPage from './pages/PaymentPage';
import AdminPayments from './pages/AdminPayments';
import PaymentHistory from './pages/PaymentHistory';
import Notifications from './pages/Notifications';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/creer"
            element={
              <PrivateRoute>
                <CreateTontine />
              </PrivateRoute>
            }
          />
          <Route
            path="/rejoindre"
            element={
              <PrivateRoute>
                <JoinTontine />
              </PrivateRoute>
            }
          />
          <Route
            path="/tontines/:id"
            element={
              <PrivateRoute>
                <TontineDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/tontines/:tontineId/payer"
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPayments />
              </PrivateRoute>
            }
          />
          <Route
            path="/historique"
            element={
              <PrivateRoute>
                <PaymentHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
