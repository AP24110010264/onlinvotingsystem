const express = require('express')
const connectDB = require('./helpers/connectDB')
let onlineVotingRoutes = require('./routes/onlinevoting.route');
let votingRoutes = require('./routes/voter.route')
require('dotenv').config()

const port = process.env.PORT || 4000;

let app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json({ limit: "10mb" }))     

app.use(express.json({ limit: "10mb" }))     
let startingServer = async () => {     
    try {
        await connectDB(process.env.MONGODB_URL)      
        console.log("database connected successfully");
        app.listen(port, () => {      
            console.log("server is running");
        })
    } catch (error) {
        console.log(error);
    }
}
app.use('/api/onlinevoting', onlineVotingRoutes)     
app.use('/api/onlinevoting', votingRoutes)     

app.use('*', (req, res, next) => {      
    res.status(200).json("File not found")
})
app.use((err, req, res, next) => {     
    res.status(500).json({ error: true, message: err.message })
})

startingServer()