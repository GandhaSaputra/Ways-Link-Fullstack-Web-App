import React from 'react'
import { useState } from 'react'
import { Navbar as NavbarComp, Container, Nav } from 'react-bootstrap'
import ModalSignIn from './modal/ModalSignIn';
import ModalSignUp from './modal/ModalSignUp';
import BrandIcon from '../assets/BrandIcon.svg'

function Navbar(props) {
    const [showSignIn, setShowSignIn] = useState(false);
    const handleCloseSignIn = () => setShowSignIn(false);
    const handleShowSignIn = () => setShowSignIn(true);

    const [showSignUp, setShow] = useState(false);
    const handleCloseSignUp = () => setShow(false);
    const handleShowSignUp = () => setShow(true);

    return (
        <>
            <NavbarComp bg="light" variant="light">
                <Container>
                    <NavbarComp.Brand href="/"><img src={BrandIcon} alt="Brand" /></NavbarComp.Brand>
                    <NavbarComp.Brand className="title-brand">{props.title}</NavbarComp.Brand>
                    {props.isLogin
                        ? <></>
                        :
                        <Nav className="ms-auto">
                            <Nav.Link onClick={handleShowSignIn}>Login</Nav.Link>
                            <Nav.Link onClick={handleShowSignUp} className="btn-register"><p className="register-text">Register</p></Nav.Link>
                        </Nav>
                    }

                </Container>
            </NavbarComp>

            <ModalSignIn show={showSignIn} onHide={handleCloseSignIn} handleShowSignUp={handleShowSignUp} />

            <ModalSignUp show={showSignUp} onHide={handleCloseSignUp} handleShowSignIn={handleShowSignIn} />
        </>
    )
}

export default Navbar
