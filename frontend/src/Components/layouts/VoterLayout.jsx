import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const VoterLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="layout-container voter-layout">
            <header className="header voter-header">
                <div className="header-left">
                    <img src={logo} alt="logo" className="logo" />
                    <h1>Online Voting</h1>
                </div>
                <nav className="nav">
                    <NavLink to="/voting" end>Vote</NavLink>
                    <span className="user-badge">{user?.fullname || 'Voter'}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </nav>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default VoterLayout;