import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import ModalSignUp from '../components/modal/ModalSignUp';
import ModalSignIn from '../components/modal/ModalSignIn';
import Navbar from '../components/Navbar'
import PhoneImg from '../assets/Phone.png'
import PcImg from '../assets/PC.png'

function LandingPage() {

    const [showSignUp, setShow] = useState(false);
    const handleCloseSignUp = () => setShow(false);
    const handleShowSignUp = () => setShow(true);

    const [showSignIn, setShowSignIn] = useState(false);
    const handleCloseSignIn = () => setShowSignIn(false);
    const handleShowSignIn = () => setShowSignIn(true);

    return (
        <div>
            <Navbar />
            <div className="container-landing-page">
                <div className="text-group-landing-page">
                    <p className="text-group-one">
                        The Only Link You’ll Ever Need
                    </p>
                    <p className="text-group-two">
                        Add a link for your Social Bio and optimize your social media traffic. <br /><br /> safe, fast and easy to use
                    </p>
                    <Button variant="dark" size="lg" className="btn-started" onClick={handleShowSignUp}>Get Started For Free</Button>
                </div>
                <div className="landing-page-img-group">
                    <img src={PhoneImg} alt="PhoneImg" className="phone-img" />
                    <img src={PcImg} alt="PhoneImg" className="pc-img" />
                </div>
            </div>
            <ModalSignIn show={showSignIn} onHide={handleCloseSignIn} handleShowSignUp={handleShowSignUp} />
            <ModalSignUp show={showSignUp} onHide={handleCloseSignUp} handleShowSignIn={handleShowSignIn} />
        </div>
    )
}

export default LandingPage
