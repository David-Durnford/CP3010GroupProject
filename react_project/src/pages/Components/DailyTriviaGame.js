import React, { useState, useEffect } from 'react';
import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle,
    MDBProgress,
    MDBProgressBar,
    MDBRow
} from "mdb-react-ui-kit";
import Login from "./Login";

function DailyTriviaGame() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [checkGameOver, setCheckGameOver] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [basicModal, setBasicModal] = useState(true);

    const toggleShow = () => setBasicModal(!basicModal);

    useEffect(() => {
        async function fetchQuestions() {
            const response = await fetch('https://the-trivia-api.com/api/questions/');
            const data = await response.json();
            setAllQuestions(data);
        }
        fetchQuestions();
    }, []);

    const handleAnswer = (answer) => {
        if (answer === allQuestions[currentQuestion].correctAnswer) {
            setUserScore(userScore + 1);
        }

        if (currentQuestion === 9) {
            setCurrentQuestion(currentQuestion + 1);
            setCheckGameOver(true);
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const showQuizContent = () => {
        if (!quizStarted) {
            return (
                <MDBBtn className='bg-warning' onClick={() => setQuizStarted(true)}>
                    Start Quiz
                </MDBBtn>
            );
        }

        if (checkGameOver) {
            return showGameOver();
        }

        return showQuestion();
    };

    const showQuestion = () => {
        if (!allQuestions.length) {
            return null; // or display a loading indicator
        }

        const question = allQuestions[currentQuestion];
        const options = [...question.incorrectAnswers, question.correctAnswer];
        options.sort(() => Math.random() - 0.5);

        return (
            <MDBContainer>
                <div>
                    <h4>{question.question}</h4>
                    <ul className="mt-5">
                        {options.map((option, index) => (
                            <div className="p-1" key={index}>
                                <MDBBtn outline rounded className='mx-2 text-lg-center' color='secondary' onClick={() => handleAnswer(option)}>
                                    {option}
                                </MDBBtn>
                            </div>
                        ))}
                    </ul>
                </div>
            </MDBContainer>
        );
    };

    const showGameOver = () => (

    <MDBCard alignment='center' className='w-25 m-auto'>
        <MDBCardBody>
            <MDBCardTitle>You scored</MDBCardTitle>
            <MDBBadge className='bg-warning mb-3'><h2>{userScore}/10</h2></MDBBadge>
            <MDBCardText>Check back tomorrow for a new Trivia Quiz! </MDBCardText>
        </MDBCardBody>
    </MDBCard>
    );

    const calculateProgress = () => {
        return ((currentQuestion / 10) * 100);
    };

    return (
        <>
            <MDBContainer className="p-3 bg-light mt-4">
                <MDBProgress height='10'>
                    <MDBProgressBar width={calculateProgress()} valuemin={0} valuemax={100} bgColor="warning"  />
                </MDBProgress>
            </MDBContainer>
            <MDBContainer className="mt-4 bg-white p-5 border-1 text-center">
                {showQuizContent()}
            </MDBContainer>

            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle><img src="https://i.imgur.com/67pcrdT.jpeg" height="50px"/> </MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody><Login /></MDBModalBody>

                        <MDBModalFooter className='justify-content-start'>
                            <MDBBtn className='w-50 bg-warning' onClick={toggleShow}>
                                Skip Sign In
                            </MDBBtn>
                            <MDBBtn className='w-50 bg-warning' onClick={toggleShow}>
                                Register
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

export default DailyTriviaGame;
