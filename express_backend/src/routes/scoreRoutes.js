import User from "../User.js";
import express from 'express';
import * as dotenv from 'dotenv';
import {isValidUser} from "../server.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

dotenv.config();

router.get('/getScore', async (req, res) => {
    try {
        const decoded = isValidUser(req)
        await User.findById(decoded.userId)
            .then((user) => {
                !user ? res.status(404).json({
                    success: false,
                    message: 'User not found'
                }) : res.status(200).json({
                        success: true,
                        data: {
                            score: {
                                total: user.score.total,
                                perfectScore: user.score.perfectScore,
                                gamesPlayed: user.score.gamesPlayed
                            }
                        }
                    }
                )
            }).catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Error getting user'
                })
                console.log(err)
            })
    } catch (err) {
        res.status(401).json({success: false, message: 'Invalid token provided'})
    }
})
router.post('/submitAnswers', async (req, res) => {
    const {score} = req.body
    try {
        const decode = isValidUser(req)
        const findUser = await User.find({email: decode.email})
        if (findUser.length !== 0) {
            const user = findUser[0]
            user.score.total += score
            user.score.gamesPlayed += 1
            if (score === 10) {
                user.score.perfectScore += 1
            }
            await user.save()
            res.status(200).json({
                success: true,
                data: {
                    total: user.score.total,
                    perfectScore: user.score.perfectScore,
                    gamesPlayed: user.score.gamesPlayed
                }
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error submitting answers \n' + err
        })
        console.log(err)
    }
})

export default router;