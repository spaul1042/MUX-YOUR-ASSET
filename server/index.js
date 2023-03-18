require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/routes');

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);  // connecting to mongodb database/cluster created on MongoDb atlas using a unique connection string  
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    const myCollection = database.collection('matches');
    console.log('Database Connected');
})
const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', routes);

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})