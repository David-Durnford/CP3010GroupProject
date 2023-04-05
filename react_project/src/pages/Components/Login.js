import React from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn
} from 'mdb-react-ui-kit';

export default function App() {
    return (
        <form>
            <MDBInput className='mb-4' type='email' id='form1Example1' label='Email address' />
            <MDBInput className='mb-4' type='password' id='form1Example2' label='Password' />
            <MDBBtn type='submit' block className='m-auto w-50 bg-warning'>
                Sign in
            </MDBBtn>
        </form>
    );
}