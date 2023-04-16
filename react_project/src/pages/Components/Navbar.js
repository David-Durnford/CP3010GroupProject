import React, {useEffect, useState} from 'react';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse, MDBIcon
} from 'mdb-react-ui-kit';

export default function App({setBasicModal}) {

    return (
        <MDBNavbar expand='lg' light bgColor='white'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='#'><img src="https://i.imgur.com/67pcrdT.jpeg" height="50px"/> </MDBNavbarBrand>
                    <MDBNavbarNav>
                        <MDBNavbarItem>
                            <MDBNavbarLink active aria-current='page' href='#' onClick={() => setBasicModal(true)}>
                                Login/Register
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
            </MDBContainer>
        </MDBNavbar>
    );
}