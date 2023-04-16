import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DailyTriviaGame from "./pages/Components/DailyTriviaGame";
import Navbar from "./pages/Components/Navbar";
import {useEffect, useState} from "react";
import {MDBContainer} from "mdb-react-ui-kit";
import {generateUsername} from 'friendly-username-generator';

function App() {
    const [playerData, setPlayerData] = useState(null);
    const [basicModal, setBasicModal] = useState(false);

    useEffect(() => {
        const loadDataFromLocalStorage = () => {
            const storedData = localStorage.getItem("playerData");
            if (storedData) {
                setPlayerData(JSON.parse(storedData));
            } else {
                const userName = generateUsername();
                const email = userName + "@trivia.com";
                const password = Math.random().toString(36).substring(2, 15);

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    "name": userName,
                    "email": email,
                    "password": password
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                fetch("/auth/register", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        setPlayerData(result.data)
                        localStorage.setItem("playerData", JSON.stringify(result.data));
                    })
                    .catch(error => console.log('error', error));

            }
        };

        loadDataFromLocalStorage();
    }, []);

    return (
        <MDBContainer>
            <Navbar setBasicModal={setBasicModal}/>
            <Router>
                <Routes>
                    <Route path="/" element={<DailyTriviaGame playerData={playerData} setPlayerData={setPlayerData}
                                                              setBasicModal={setBasicModal} basicModal={basicModal}/>}/>
                </Routes>
            </Router>
        </MDBContainer>
    );
}

export default App;
