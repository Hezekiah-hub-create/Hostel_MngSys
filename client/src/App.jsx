import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import RoomsPage from './pages/RoomsPage';
import ClientDashboard from './pages/ClientDashboard';
import GastronomyPage from './pages/GastronomyPage';
import DiningReservationPage from './pages/DiningReservationPage';
import Navbar from './components/Navbar';
// Removed Sidebar

// A simple PrivateRoute that checks token and role
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  // Remove walk-in ChangePassword logic for clients as they just register directly

  // If role isn't allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return (
    <>
      {children}
    </>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/gastronomy" element={<GastronomyPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/client-dashboard" element={
          <PrivateRoute allowedRoles={['client']}>
            <ClientDashboard />
          </PrivateRoute>
        } />
        <Route path="/dining-reservation" element={
          <PrivateRoute allowedRoles={['client']}>
            <DiningReservationPage />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
