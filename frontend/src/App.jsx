import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLayout from './Components/layouts/AuthLayout';
import AdminLayout from './Components/layouts/AdminLayout';
import VoterLayout from './Components/layouts/VoterLayout';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import AdminDashboard from './Components/Admin/pages/AdminDashboard';
import ElectionsPage from './Components/Admin/pages/ElectionsPage';
import CandidatesPage from './Components/Admin/pages/CandidatesPage';
import VotingPage from './Components/Voter/pages/VotingPage';
import './Styles/global.css';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-spinner" style={{ height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/voting'} replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-spinner" style={{ height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route
                    path="/login"
                    element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/voting'} replace /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/voting'} replace /> : <SignUp />}
                />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="elections" element={<ElectionsPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
            </Route>

            <Route
                path="/voting"
                element={
                    <ProtectedRoute allowedRole="voter">
                        <VoterLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<VotingPage />} />
            </Route>

            <Route
                path="/"
                element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/voting') : '/login'} replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;