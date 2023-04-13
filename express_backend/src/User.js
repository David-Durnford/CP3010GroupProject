import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    score: {
        total: {
            type: Number,
            required: true
        },
        perfectScore: {
            type: Number,
            required: true
        },
        gamesPlayed: {
            type: Number,
            required: true
        }
    },
    dateCreated: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
export default User;
