import { useState, useEffect } from 'react';
import axios from 'axios';
import api, { getAuthHeaders } from '../../../config/api';

const AdminDashboard = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get(api.getResult, { headers: getAuthHeaders() });
            setResults(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortedResults = [...results].sort((a, b) => b.votes - a.votes);
    const winner = sortedResults[0];

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Election Results</h2>
                <p>Live voting statistics and winner announcement</p>
            </div>

            {results.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3>No Results Yet</h3>
                        <p>No election results available at the moment.</p>
                    </div>
                </div>
            ) : (
                <div className="grid-2">
                    <div className="card">
                        <div className="card-header">
                            <h3>Vote Counts</h3>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Election</th>
                                        <th>Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedResults.map((result, index) => (
                                        <tr key={result._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <img
                                                        src={result.candidate_photo}
                                                        alt={result.candidate_name}
                                                        className="candidate-photo"
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 500 }}>{result.candidate_name}</div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                            {result.candidate_address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{result.election_topic}</td>
                                            <td>
                                                <span style={{
                                                    background: index === 0 ? '#dcfce7' : '#f3f4f6',
                                                    color: index === 0 ? '#166534' : '#374151',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontWeight: 500
                                                }}>
                                                    {result.votes}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {winner && (
                        <div className="winner-card">
                            <h3>Trophy Winner</h3>
                            <img src={winner.candidate_photo} alt={winner.candidate_name} className="winner-photo" />
                            <div className="winner-name">{winner.candidate_name}</div>
                            <p style={{ color: '#78350f', marginTop: '0.5rem' }}>{winner.candidate_address}</p>
                            <div style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 700, color: '#92400e' }}>
                                {winner.votes} Votes
                            </div>
                            <p style={{ color: '#92400e', marginTop: '0.5rem' }}>{winner.election_topic}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;