import React, {useState} from 'react';
import LoginCard from "./Components/LoginCard";
import SignupCard from "./Components/SignupCard";

export default function LoginSignup() {
    const [login, setLogin] = useState(true);
    return (
        <div>
            { login ? (
                <LoginCard setLogin={setLogin}/>
            ) : (
                <SignupCard setLogin={setLogin}/>
            )}
        </div>
    )
}