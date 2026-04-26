import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api, { getAuthHeaders } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        voter_id: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.trim() }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.voter_id) {
            newErrors.voter_id = 'Voter ID is required';
        }
        if (!data.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post(api.login, formData);
            const { data, token } = response.data;

            login(data, token);

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/voting');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

            <div className="form-group">
                <label htmlFor="voter_id">Voter ID</label>
                <input
                    type="text"
                    id="voter_id"
                    name="voter_id"
                    value={formData.voter_id}
                    onChange={handleChange}
                    placeholder="Enter your Voter ID"
                />
                {errors.voter_id && <span className="error-text">{errors.voter_id}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-footer">
                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </form>
    );
};

export default Login;