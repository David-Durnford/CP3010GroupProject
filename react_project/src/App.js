import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyTriviaGame from "./pages/Components/DailyTriviaGame";
import Navbar from "./pages/Components/Navbar";
import { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";

function App() {
    const [playerData, setPlayerData] = useState(null);

    useEffect(() => {
        const loadDataFromLocalStorage = () => {
            const storedData = localStorage.getItem("playerData");
            if (storedData) {
                setPlayerData(JSON.parse(storedData));
            } else {
                const newData = {
                    name: "loggedInUser",
                    email: "loggedInUser",
                    totalScore: 0,
                    totalPlayed: 0,
                    perfectGames: 0,
                };
                localStorage.setItem("playerData", JSON.stringify(newData));
                setPlayerData(newData);
            }
        };

        loadDataFromLocalStorage();
    }, []);

    console.log(playerData);

    return (
        <MDBContainer>
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/" element={<DailyTriviaGame playerData={playerData} setPlayerData={setPlayerData} />} />
                </Routes>
            </Router>
        </MDBContainer>
    );
}

export default App;
