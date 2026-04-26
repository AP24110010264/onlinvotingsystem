const API_BASE_URL = 'http://localhost:4000/api/onlinevoting';

const api = {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    addElection: `${API_BASE_URL}/addelection`,
    addCandidate: `${API_BASE_URL}/addcandidate`,
    getElections: `${API_BASE_URL}/get-elections`,
    getActiveElections: `${API_BASE_URL}/get-active-elections`,
    getCandidates: `${API_BASE_URL}/get-candidates`,
    getElectionCandidates: `${API_BASE_URL}/get-election-candidates`,
    getVoters: `${API_BASE_URL}/get-voters`,
    getResult: `${API_BASE_URL}/get-result`,
    deleteElection: (id) => `${API_BASE_URL}/delete-election/${id}`,
    voting: `${API_BASE_URL}/voting`,
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;