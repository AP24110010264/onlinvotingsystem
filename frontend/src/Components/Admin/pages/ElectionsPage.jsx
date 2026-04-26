import { useState, useEffect } from 'react';
import axios from 'axios';
import api, { getAuthHeaders } from '../../../config/api';

const ElectionsPage = () => {
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        election_topic: '',
        no_of_candidates: '',
        starting_date: '',
        ending_date: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(api.getElections, { headers: getAuthHeaders() });
            setElections(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching elections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.election_topic) newErrors.election_topic = 'Election topic is required';
        if (!data.starting_date) newErrors.starting_date = 'Starting date is required';
        if (!data.ending_date) newErrors.ending_date = 'Ending date is required';
        if (new Date(data.starting_date) > new Date(data.ending_date)) {
            newErrors.ending_date = 'Ending date must be after starting date';
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

        setIsSubmitting(true);
        try {
            await axios.post(api.addElection, formData, { headers: getAuthHeaders() });
            setShowModal(false);
            setFormData({ election_topic: '', no_of_candidates: '', starting_date: '', ending_date: '' });
            fetchElections();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add election');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this election?')) return;
        try {
            await axios.delete(api.deleteElection(id), { headers: getAuthHeaders() });
            fetchElections();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete election');
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header flex-between">
                <div>
                    <h2>Elections</h2>
                    <p>Manage election campaigns</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Election
                </button>
            </div>

            <div className="card">
                {elections.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3>No Elections Found</h3>
                        <p>Create your first election to get started.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Election Topic</th>
                                    <th>Candidates</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elections.map((election, index) => (
                                    <tr key={election._id}>
                                        <td>{index + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{election.election_topic}</td>
                                        <td>{election.no_of_candidates}</td>
                                        <td>{formatDate(election.starting_date)}</td>
                                        <td>{formatDate(election.ending_date)}</td>
                                        <td>
                                            <span className={`status-badge ${election.status === 'active' ? 'status-active' : 'status-expired'}`}>
                                                {election.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(election._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                        <div className="card-header">
                            <h3>Add New Election</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Election Topic</label>
                                <input
                                    type="text"
                                    name="election_topic"
                                    value={formData.election_topic}
                                    onChange={handleChange}
                                    placeholder="Enter election topic"
                                />
                                {errors.election_topic && <span className="error-text">{errors.election_topic}</span>}
                            </div>
                            <div className="form-group">
                                <label>Number of Candidates</label>
                                <input
                                    type="number"
                                    name="no_of_candidates"
                                    value={formData.no_of_candidates}
                                    onChange={handleChange}
                                    placeholder="Enter number of candidates"
                                />
                                {errors.no_of_candidates && <span className="error-text">{errors.no_of_candidates}</span>}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="starting_date"
                                        min={getTodayDate()}
                                        value={formData.starting_date}
                                        onChange={handleChange}
                                    />
                                    {errors.starting_date && <span className="error-text">{errors.starting_date}</span>}
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="ending_date"
                                        min={formData.starting_date || getTodayDate()}
                                        value={formData.ending_date}
                                        onChange={handleChange}
                                    />
                                    {errors.ending_date && <span className="error-text">{errors.ending_date}</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Election'}
                                </button>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: '#e5e7eb', color: '#374151' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElectionsPage;