import User from "../User.js";
import express from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

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
                        res.status(400).send('Incorrect username/password combination')
                    }
                })
        } else {
            res.status(400).send('Incorrect username/password combination')
        }
    } catch (err) {
        res.status(500).send('Error logging in')
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

export default router