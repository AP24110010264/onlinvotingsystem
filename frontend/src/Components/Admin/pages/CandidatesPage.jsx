import { useState, useEffect } from 'react';
import axios from 'axios';
import api, { getAuthHeaders } from '../../../config/api';

const CandidatesPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        election_id: '',
        candidate_name: '',
        candidate_contact: '',
        candidate_address: '',
        candidate_photo: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('Fetching data...');
            console.log('Token being sent:', getAuthHeaders());
            const [candidatesRes, electionsRes] = await Promise.all([
                axios.get(api.getCandidates, { headers: getAuthHeaders() }),
                axios.get(api.getActiveElections, { headers: getAuthHeaders() }),
            ]);
            console.log('Candidates response:', candidatesRes);
            console.log('Elections response:', electionsRes);
            console.log('Elections response.data:', electionsRes?.data);
            console.log('Elections response.data.data:', electionsRes?.data?.data);
            setCandidates(candidatesRes.data?.data || []);
            setElections(electionsRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, candidate_photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.election_id) newErrors.election_id = 'Election is required';
        if (!data.candidate_name) newErrors.candidate_name = 'Candidate name is required';
        if (!data.candidate_contact) newErrors.candidate_contact = 'Contact is required';
        else if (!/^\d{10}$/.test(data.candidate_contact)) newErrors.candidate_contact = 'Must be 10 digits';
        if (!data.candidate_address) newErrors.candidate_address = 'Address is required';
        if (!data.candidate_photo) newErrors.candidate_photo = 'Photo is required';
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
            await axios.post(api.addCandidate, formData, {
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            });
            setShowModal(false);
            setFormData({ election_id: '', candidate_name: '', candidate_contact: '', candidate_address: '', candidate_photo: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add candidate');
        } finally {
            setIsSubmitting(false);
        }
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
                    <h2>Candidates</h2>
                    <p>Manage election candidates</p>
                </div>
                <button className="btn btn-primary" onClick={() => { console.log('Opening modal, elections state:', elections); fetchData(); setShowModal(true); }}>
                    Add Candidate
                </button>
            </div>

            <div className="card">
                {candidates.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3>No Candidates Found</h3>
                        <p>Add candidates to your elections.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Election</th>
                                    <th>Address</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={candidate._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={candidate.candidate_photo}
                                                alt={candidate.candidate_name}
                                                className="candidate-photo"
                                            />
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{candidate.candidate_name}</td>
                                        <td>{candidate.election_topic}</td>
                                        <td>{candidate.candidate_address}</td>
                                        <td>{candidate.candidate_contact}</td>
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
                            <h3>Add New Candidate</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Election</label>
                                <select name="election_id" value={formData.election_id} onChange={handleChange}>
                                    <option value="">Select Election</option>
                                    {console.log('Rendering dropdown, elections:', elections)}
                                    {elections && elections.length > 0 ? elections.map((election) => (
                                        <option key={election._id} value={election._id}>
                                            {election.election_topic}
                                        </option>
                                    )) : <option disabled>No active elections</option>}
                                </select>
                                {errors.election_id && <span className="error-text">{errors.election_id}</span>}
                            </div>
                            <div className="form-group">
                                <label>Candidate Name</label>
                                <input
                                    type="text"
                                    name="candidate_name"
                                    value={formData.candidate_name}
                                    onChange={handleChange}
                                    placeholder="Enter candidate name"
                                />
                                {errors.candidate_name && <span className="error-text">{errors.candidate_name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="candidate_address"
                                    value={formData.candidate_address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                />
                                {errors.candidate_address && <span className="error-text">{errors.candidate_address}</span>}
                            </div>
                            <div className="form-group">
                                <label>Contact</label>
                                <input
                                    type="text"
                                    name="candidate_contact"
                                    value={formData.candidate_contact}
                                    onChange={handleChange}
                                    placeholder="10-digit contact"
                                    maxLength={10}
                                />
                                {errors.candidate_contact && <span className="error-text">{errors.candidate_contact}</span>}
                            </div>
                            <div className="form-group">
                                <label>Photo</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {formData.candidate_photo && (
                                    <img src={formData.candidate_photo} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', marginTop: '0.5rem', objectFit: 'cover' }} />
                                )}
                                {errors.candidate_photo && <span className="error-text">{errors.candidate_photo}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Candidate'}
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

export default CandidatesPage;