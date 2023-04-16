import User from "../User.js";
import express from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { generateUsername } from 'friendly-username-generator';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const findUser = await User.find({email: email})
        if (findUser.length !== 0) {
            bcrypt
                .compare(password, findUser[0].password)
                .then((result) => {
                    if (result) {
                        const token = jsonwebtoken.sign({
                                email: findUser[0].email,
                                userId: findUser[0]._id,
                                role: findUser[0].role
                            },
                            process.env.JWT_SECRET
                        )
                        res.status(200).json({
                            success: true,
                            data: {
                                userId: findUser[0]._id,
                                email: findUser[0].email,
                                role: findUser[0].role,
                                token: token
                            }
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Incorrect username/password combination'
                        })
                    }
                })
        } else {
            res.status(400).json({
                success: false,
                message: 'Incorrect username/password combination'
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error logging in \n' + err
        })
        console.log(err)
    }
})

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body
    try {
        const findUser = await User.find({email: email})

        if (findUser.length > 0) {
            res.status(400).send('User already exists')
            return
        }
        let hashedPassword = await bcrypt.hash(password, 8)

        const newUser = User({
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
        await newUser.save()

        const token = jsonwebtoken.sign({
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWT_SECRET
        )
        res.status(200).json({
            success: true,
            data: {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
                token: token
            }
        })
    } catch (err) {
        res.status(500).send('Error creating user \n' + err)
        console.log(err)
    }
})

router.get('/createRandomUser', async (req, res) => {
    const userName = generateUsername()
    const email = crypto.randomUUID() + '@fakemail.com'
    const password = Math.random().toString(36).substring(2, 15)
    try {
        res.status(200).json({
            success: true,
            data: {
                username: userName,
                email: email,
                password: password
            }
        })
    }catch (err){
        res.status(500).send('Error creating user \n' + err)
        console.log(err)
    }
})

export default router