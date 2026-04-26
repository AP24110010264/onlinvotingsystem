import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const AdminLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="layout-container">
            <header className="header">
                <div className="header-left">
                    <img src={logo} alt="logo" className="logo" />
                    <h1>VoteAdmin</h1>
                </div>
                <nav className="nav">
                    <NavLink to="/admin" end>Dashboard</NavLink>
                    <NavLink to="/admin/elections">Elections</NavLink>
                    <NavLink to="/admin/candidates">Candidates</NavLink>
                    <span className="user-badge">{user?.fullname || 'Admin'}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </nav>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;