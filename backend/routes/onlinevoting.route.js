const express = require('express')
const { addElection, addCandidate, UserRegistrion, userLogin, getElections, getCandidates, deleteElection, getActiveElections } = require('../controllers/admin.controller')
const { authenticateToken, adminOnly } = require('../middleware/auth')
const route = express.Router()

route.post('/register', UserRegistrion)
route.post('/login', userLogin)
route.post('/addelection', authenticateToken, adminOnly, addElection)
route.post('/addcandidate', authenticateToken, adminOnly, addCandidate)
route.get('/get-elections', getElections)
route.get('/get-active-elections', getActiveElections)
route.get('/get-candidates', getCandidates)
route.delete('/delete-election/:id', authenticateToken, adminOnly, deleteElection)

module.exports = route 