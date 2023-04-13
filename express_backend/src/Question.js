import mongoose from 'mongoose';


const questionSchema = new mongoose.Schema({
    category: String,
    id: {
        type: String, required: false
    },
    correctAnswer: String,
    incorrectAnswers: [String],
    question: String,
    tags: [String],
    type: String,
    difficulty: String,
    regions: {
        type: [String], required: false
    },
    isNiche: {
        type: Boolean, required: false
    },
    date: String
})

function AllFieldsRequiredByDefault(schema) {
    for (const i in schema.paths) {
        const attribute = schema.paths[i];
        if (attribute.isRequired === undefined) {
            attribute.required(true);
        }
    }
}

AllFieldsRequiredByDefault(questionSchema)

const Question = mongoose.model('Question', questionSchema);
export default Question;
