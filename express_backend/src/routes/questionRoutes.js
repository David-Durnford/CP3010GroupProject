import User from "../User.js";
import express from 'express';
import bcrypt from 'bcrypt';
import Question from "../Question.js";
import {isValidUser} from "../server.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/fetchQuestions', async (req, res) => {
    try {
        const decoded = isValidUser(req);
        if (decoded.role !== 'admin') {
            res.status(401).json({success: false, message: 'Unauthorized'})
            return
        }
        fetch(process.env.QUESTIONSAPI)
            .then(response => response.json())
            .then(async data => {
                const currDate = new Date();
                for (const dataElement of data) {
                    dataElement['date'] = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
                }
                await Question.insertMany(data)
                res.status(200).json({
                    success: true,
                    message: 'Questions successfully fetched'
                })
            })
    } catch (err) {
        res.status(500).send('Error fetching questions')
        console.log(err)
    }
})

router.get('/getDailyQuestions', async (req, res) => {
    const currDate = new Date();
    const date = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;
    await Question.find({date: date}).limit(10)
        .then((questions) => {
            res.status(200).json({
                success: true,
                data: questions
            })
        }).catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Error getting questions \n' + err
            })
            console.log(err)
        })
})

router.delete('/deleteQuestions', async (req, res) => {
    try {
        const decoded = isValidUser(req);
        if (decoded.role !== 'admin') {
            res.status(401).json({success: false, message: 'Unauthorized'})
            return
        }
        await Question.deleteMany({})
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Questions successfully deleted'
                })
            }).catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Error deleting questions \n' + err
                })
            })
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err instanceof TypeError) {
            res.status(401).json({success: false, message: 'Invalid token provided'})
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting questions'
            })
            console.log(err)
        }
    }
})

router.post('/addCustomQuestions', async (req, res) => {
    const {questions} = req.body
    const date = new Date()

    if (questions === undefined || questions.length === 0) {
        res.status(400).send('No questions provided')
        return
    }
    try {
        for (const question of questions) {
            question['date'] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        await Question.insertMany(questions)
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Questions successfully added'
                })
            }).catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Error adding questions \n' + err
                })
                console.log(err)
            })
    } catch (err) {
        res.status(500).send('Error adding questions \n' + err)
        console.log(err)
    }
})

export default router