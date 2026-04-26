import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../config/api';

const SignUp = () => {
    const [formData, setFormData] = useState({
        voter_id: '',
        firstname: '',
        lastname: '',
        contact: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.trim() }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (data) => {
        const newErrors = {};

        if (!data.firstname) {
            newErrors.firstname = 'First name is required';
        }
        if (!data.voter_id) {
            newErrors.voter_id = 'Voter ID is required';
        }
        if (!data.contact) {
            newErrors.contact = 'Contact number is required';
        } else if (!/^\d{10}$/.test(data.contact)) {
            newErrors.contact = 'Contact must be 10 digits';
        }
        if (!data.password) {
            newErrors.password = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(data.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
        }
        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
        setSuccessMessage('');

        try {
            const response = await axios.post(api.register, formData);
            if (response.data.error === false) {
                setSuccessMessage('Registration successful! Please login.');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="First name"
                    />
                    {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Last name"
                    />
                </div>
            </div>

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
                <label htmlFor="contact">Contact Number</label>
                <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="10-digit contact number"
                    maxLength={10}
                />
                {errors.contact && <span className="error-text">{errors.contact}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="auth-footer">
                <p>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </form>
    );
};

export default SignUp;