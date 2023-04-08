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
                    <Route path="/" element={<DailyTriviaGame />} />
                </Routes>
            </Router>
        </MDBContainer>

    );
}

export default App;
