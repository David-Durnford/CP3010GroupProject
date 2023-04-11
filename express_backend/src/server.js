import express from 'express';
import * as dotenv from 'dotenv';
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

app.get('/api/getDailyQuestions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_CONNECT)
    const currDate = new Date();
    const date = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
    await Question.find({date: date})
        .then((questions) => {
            res.status(200).send(questions)
        }).catch((err) => {
            res.status(500).send('Error getting questions')
            console.log(err)
        })
})

app.post('/api/submitAnswers', async (req, res) => {
    const {email , score} = req.body
    await mongoose.connect(process.env.MONGO_CONNECT)
    console.log(score)

    try{
        const findUser = await User.find({email: email})
        if(findUser.length !== 0){
            const user = findUser[0]
            console.log(user)
            user.score.total += score
            user.score.gamesPlayed += 1
            if(score === 10){
                user.score.perfectScore += 1
            }
            await user.save()
            res.status(200).send('Answers submitted')
        }
    }catch (err){
        res.status(500).send('Error submitting answers')
        console.log(err)
    }
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
                        res.status(200).send('Login successful')
                    }else{
                        res.status(400).send('Incorrect username/password combination')
                    }
                })
        }else {
            res.status(400).send('Incorrect username/password combination')
        }
    }catch (err) {
        res.status(500).send('Error logging in')
        console.log(err)
    }
})

app.post('/api/register', async (req, res) => {
    const { name, email, password} = req.body
    await mongoose.connect(process.env.MONGO_CONNECT)

    try{
        const findUser = await User.find({email: email})

        if(findUser.length > 0){
            res.status(400).send('User already exists')
            return
        }
        let hashedPassword = await bcrypt.hash(password, 8)

        const newUser = await User.create({
            username: name,
            email: email,
            password: hashedPassword,
            score: {
                total: 0,
                perfectScore: 0,
                gamesPlayed: 0
            },
            dateCreated: new Date()
        })
        newUser.save()
        res.status(201).send('User created')
    }catch (err){
        res.status(500).send('Error creating user')
        console.log(err)}

})

app.get('/api/getScore', async (req, res) => {
    await mongoose.connect(process.env.MONGO_CONNECT)
    await User.findById(req.query.id)
        .then((user) => {
            !user ? res.status(404).send('User not found') : res.status(200).send(user.score)
        }).catch((err) => {
            res.status(500).send('Error getting score')
            console.log(err)
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})