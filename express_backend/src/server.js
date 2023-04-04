import express from 'express';
import * as dotenv from 'dotenv';
import {MongoClient } from 'mongodb';
dotenv.config();

const app = express();
const port = 8000;
const dbName = 'trivia';
app.get('/api/fetchQuestions', async (req, res) => {
    fetch(process.env.QUESTIONSAPI)
        .then(response => response.json())
        .then(async data => {
            const currDate = new Date();
            for (const dataElement of data) {
                dataElement['date'] = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
            }
            console.log(data)
            const client = new MongoClient(process.env.MONGO_CONNECT);
            await client.connect();
            const db = client.db(dbName);
            await db.collection('questions').insertMany(data);

            res.send('Questions successfully fetched')
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/api/submitAnswers', async (req, res) => {
  //TODO - Implement
})

app.post('/api/login', async (req, res) => {
    //TODO - Implement
})

app.post('/api/register', async (req, res) => {
    //TODO - Implement
})

app.get('/api/getScore', async (req, res) => {
    //TODO - Implement
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})