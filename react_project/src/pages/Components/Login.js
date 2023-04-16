import React, {useState, useEffect} from 'react';
import {MDBInput, MDBBtn} from 'mdb-react-ui-kit';

const Login = ({setBasicModal, setPlayerData, register, setCurrentStats}) => {
    const [error, setError] = useState(null);
    const [fetchResponse, setFetchResponse] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        let name;

        let raw = JSON.stringify({
            "email": email,
            "password": password
        });

        if (register) {
            const name = event.target.name.value;
            const confirmPassword = event.target.confirmPassword.value;
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            raw = JSON.stringify({
                "name": name,
                "email": email,
                "password": password
            })
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const res = (!register ? await fetch("/auth/login", requestOptions) : await fetch("/auth/register", requestOptions))
        const data = await res.json()
        setFetchResponse(data)

        const score = fetch('/score/getScore', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + data.data.token
            },
            redirect: 'follow'
        }).then(response => response.json()).then(result => {
            console.log(result)
            setCurrentStats(result.data.score)
        })
    }
    useEffect(() => {
        fetchResponse.message ? setError(fetchResponse.message) : setError(null);
        if (fetchResponse.success === true) {
            localStorage.clear();
            localStorage.setItem("playerData", JSON.stringify(fetchResponse.data));
            setBasicModal(false);
            setPlayerData(fetchResponse.data);
        }
    }, [fetchResponse])


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <MDBInput label="Email" id="email"/>
                <br/>
                {register && <MDBInput label="Name" id="name"/>}
                <br/>
                <MDBInput label="Password" id="password"/>
                <br/>
                {register && <MDBInput label="Confirm Password" id="confirmPassword"/>}
                <br/>
                {register ? <MDBBtn color="secondary">Register</MDBBtn> : <MDBBtn color="primary">Login</MDBBtn>}
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
