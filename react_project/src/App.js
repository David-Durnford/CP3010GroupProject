import './App.css';
import LoginSignup from "./pages/LoginSignup";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyTriviaGame from "./pages/Components/DailyTriviaGame";
import Navbar from "./pages/Components/Navbar";
import {useEffect, useState} from "react";
import {MDBContainer} from "mdb-react-ui-kit";


function App() {
    return (
        // insert the latest version of Router here
        <MDBContainer>
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/daily-trivia-game" element={<DailyTriviaGame />} />
                    <Route path="/" element={<LoginSignup />} />
                </Routes>
            </Router>
        </MDBContainer>

    );
}

export default App;
