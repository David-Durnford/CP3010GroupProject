import express from 'express';
import * as dotenv from 'dotenv';
import {MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from "./User.js";
import Question from "./Question.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
const port = 8000;

app.get('/api/fetchQuestions', async (req, res) => {
    fetch(process.env.QUESTIONSAPI)
        .then(response => response.json())
        .then(async data => {
            const currDate = new Date();
            for (const dataElement of data) {
                dataElement['date'] = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
            }
            console.log(data)
            await mongoose.connect(process.env.MONGO_CONNECT)
            await Question.insertMany(data)

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
    const { email, password} = req.body
    await mongoose.connect(process.env.MONGO_CONNECT)

    try{
        const findUser = await User.find({email: email})
        if(findUser.length !== 0){
            bcrypt
                .compare(password, findUser[0].password)
                .then((result) => {
                    if(result){
                        res.send(findUser)
                    }else{
                        res.send("Incorrect username/password combination")
                    }
                })
        }else {
            res.send("Incorrect username/password combination")
        }
    }catch (err) {
        console.log(err)
    }
})

app.post('/api/register', async (req, res) => {
    const { name, email, password} = req.body
    await mongoose.connect(process.env.MONGO_CONNECT)

    try{
        const findUser = await User.find({email: email})

        if(findUser.length > 0){
            res.send("User already exists")
            return
        }
        let hashedPassword = await bcrypt.hash(password, 8)

        const newUser = await User.create({
            username: name,
            email: email,
            password: hashedPassword,
            score: 0,
            dateCreated: new Date()
        })
        res.send(newUser)
    }catch (err){
        res.send("User could not be created")
        console.log(err)}

})

app.get('/api/getScore', async (req, res) => {
    //TODO - Implement
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})