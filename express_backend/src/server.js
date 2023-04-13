import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import scoreRoutes from "./routes/scoreRoutes.js";
import authRoutes from "./routes/authorizationRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

dotenv.config();

const app = express();
app.use('/score', scoreRoutes);
app.use('/auth', authRoutes)
app.use('/questions', questionRoutes);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 8000;



export function isValidUser(req) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return false
    }
    return jsonwebtoken.verify(token, process.env.JWT_SECRET)
}

mongoose.connect(process.env.MONGO_CONNECT)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }).catch((err) => {
    console.log(err)
})
