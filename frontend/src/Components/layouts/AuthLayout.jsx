import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={logo} alt="logo" />
                    <h1>Online Voting System</h1>
                    <p>Secure & Transparent Elections</p>
                </div>
                <Outlet />
            </div>
            <div className="auth-bg"></div>
        </div>
    );
};

export default AuthLayout;