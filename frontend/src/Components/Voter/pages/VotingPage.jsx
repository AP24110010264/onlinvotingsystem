import { useState, useEffect } from 'react';
import axios from 'axios';
import api, { getAuthHeaders } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

const VotingPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const candidatesRes = await axios.get(api.getElectionCandidates, { headers: getAuthHeaders() });
            setCandidates(candidatesRes.data?.data || []);

            try {
                const votersRes = await axios.get(api.getVoters, { headers: getAuthHeaders() });
                setVoters(votersRes.data?.data || []);
            } catch {
                setVoters([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const hasVoted = voters.some((v) => v.voter_id === user?.voter_id);

    const handleVote = async (candidate) => {
        if (hasVoted) {
            alert('You have already voted!');
            return;
        }

        if (!window.confirm(`Vote for ${candidate.candidate_name}?`)) return;

        try {
            await axios.post(
                api.voting,
                {
                    election_id: candidate.election_id,
                    voter_id: user.voter_id,
                    candidate_id: candidate._id,
                },
                { headers: getAuthHeaders() }
            );
            alert('Vote cast successfully!');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cast vote');
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
            <div className="page-header">
                <h2>Cast Your Vote</h2>
                <p>Select your preferred candidate</p>
            </div>

            {hasVoted && (
                <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                    You have already cast your vote. Thank you for participating!
                </div>
            )}

            <div className="card">
                {candidates.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3>No Active Elections</h3>
                        <p>There are no active elections at the moment.</p>
                    </div>
                ) : (
                    <>
                        <div className="card-header">
                            <h3>Available Candidates</h3>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sl.No</th>
                                        <th>Candidate</th>
                                        <th>Photo</th>
                                        <th>Address</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.map((candidate, index) => (
                                        <tr key={candidate._id}>
                                            <td>{index + 1}</td>
                                            <td style={{ fontWeight: 500 }}>{candidate.candidate_name}</td>
                                            <td>
                                                <img
                                                    src={candidate.candidate_photo}
                                                    alt={candidate.candidate_name}
                                                    className="candidate-photo"
                                                />
                                            </td>
                                            <td>{candidate.candidate_address}</td>
                                            <td>
                                                {hasVoted ? (
                                                    <span className="voted-badge">Voted</span>
                                                ) : (
                                                    <button
                                                        className="vote-btn"
                                                        onClick={() => handleVote(candidate)}
                                                    >
                                                        Vote
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VotingPage;