import React, {useState, useEffect} from 'react';
import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBContainer,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle,
    MDBProgress,
    MDBProgressBar
} from "mdb-react-ui-kit";
import Login from "./Login";
import UserDataDisplay from './UserDataDisplay';


function DailyTriviaGame({playerData, setPlayerData, basicModal, setBasicModal}) {
    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [checkGameOver, setCheckGameOver] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [register, setRegister] = useState(false);
    const [fetchUpdateScore, setFetchUpdateScore] = useState(false);
    const [currentStats, setCurrentStats] = useState({total: 0, gamesPlayed: 0, perfectScore: 0});



    const toggleShow = () => setBasicModal(!basicModal);


    const fetchQuestions = async () => {
        const response = await fetch('/questions/getDailyQuestions');
        const data = await response.json();

        const formattedQuestions = data.data.map((question) => ({
            ...question,
            incorrectAnswers: question.incorrectAnswers,
            correctAnswer: question.correctAnswer,
        }));

        setAllQuestions(formattedQuestions);
    };


    useEffect(() => {
        fetchQuestions();
    }, []);


    const handleAnswer = (answer) => {
        if (answer === allQuestions[currentQuestion].correctAnswer) {
            setUserScore(userScore + 1);
        }

        if (currentQuestion === 9) {
            setCurrentQuestion(currentQuestion + 1);
            setCheckGameOver(true);
            updatePlayerData(); //// Call this function when the game is over
            localStorage.setItem("attemptedDate", new Date().toLocaleDateString());
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const updatePlayerData = async () => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + playerData.token);
        const raw = JSON.stringify({"score": userScore});
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const data = await fetch("/score/submitAnswers", requestOptions)
        const result = await data.json()
        setFetchUpdateScore(result)
    };
    useEffect(() => {
        if (fetchUpdateScore.success === true) {
            localStorage.setItem("score", JSON.stringify(fetchUpdateScore.data));
        }
    }, [fetchUpdateScore])


    const showQuizContent = () => {
        if (!quizStarted) {
            return (
                localStorage.getItem("attemptedDate") !== new Date().toLocaleDateString() ?
                    <>
                        <UserDataDisplay playerData={playerData} currentStats={currentStats} setCurrentStats={setCurrentStats}/>
                        <MDBBtn className='bg-warning' onClick={() => setQuizStarted(true)}>
                            Start Quiz
                        </MDBBtn>
                    </> :
                    <>
                        <UserDataDisplay playerData={playerData} currentStats={currentStats} setCurrentStats={setCurrentStats}/>
                        <MDBBtn className='bg-warning' onClick={() => setQuizStarted(false)}>
                            Quiz Already Attempted Please Try Again Tomorrow
                        </MDBBtn>
                    </>

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
                                <MDBBtn outline rounded className='mx-2 text-lg-center' color='secondary'
                                        onClick={() => handleAnswer(option)}>
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
        <>

            <MDBCard alignment='center' className='w-25 m-auto'>
                <MDBCardBody>
                    <MDBCardTitle>You scored</MDBCardTitle>
                    <MDBBadge className='bg-warning mb-3'><h2>{userScore}/10</h2></MDBBadge>
                    <MDBCardText>Check back tomorrow for a new Trivia Quiz! </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            <UserDataDisplay playerData={playerData} currentStats={currentStats} setCurrentStats={setCurrentStats}/>
        </>
    );


    const calculateProgress = () => {
        return ((currentQuestion / 10) * 100);
    };




    return (
        <>
            <MDBContainer className="p-3 bg-light mt-4">
                <MDBProgress height='10'>
                    <MDBProgressBar width={calculateProgress()} valuemin={0} valuemax={100} bgColor="warning"/>
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
                        <MDBModalBody><Login setBasicModal={setBasicModal} setPlayerData={setPlayerData}
                                             register={register} setCurrentStats={setCurrentStats}/></MDBModalBody>

                        <MDBModalFooter className='justify-content-start'>
                            <MDBBtn className='w-50 bg-warning' onClick={toggleShow}>
                                Skip Sign In
                            </MDBBtn>
                            <MDBBtn className='w-50 bg-warning' onClick={() => setRegister(true)}>
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
