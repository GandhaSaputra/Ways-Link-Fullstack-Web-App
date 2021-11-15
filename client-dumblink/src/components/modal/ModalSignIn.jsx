import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router';
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { UserContext } from '../../config/UserContext'
import { API, setAuthToken } from '../../config/API'

function ModalSignIn(props) {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const history = useHistory();

    const { email, password } = form;
    const [message, setMessage] = useState(null);
    const [state, dispatch] = useContext(UserContext);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const onClickHere = () => {
        props.handleShowSignUp();
        props.onHide();
    }

    const handleOnSubmit = async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };

            const body = JSON.stringify(form);

            const response = await API.post("/login", body, config);
            console.log(response)

            console.log(response.data.data)

            if (response?.status === 200) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data,
                });

                localStorage.setItem("token", response.data.data.token);
                setAuthToken(response.data.data.token);

                history.push(
                    history.push('/template')
                );
            }
            // if (response?.status === 400) {
            //   const alert = (
            //     <Alert variant="danger" className="py-1">
            //       Email tidak terdaftar
            //     </Alert>
            //   );
            //   setMessage(alert);
            // }
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    Email and Password not match
                </Alert>
            );
            setMessage(alert);
        }
    };


    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Title>Sign In</Modal.Title>
                <Modal.Body>
                    <Form onSubmit={handleOnSubmit}>
                        {message}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control className="input-signin" id="email" value={email} name="email" onChange={handleChange} type="email" placeholder="Email" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control className="input-signin" id="password" value={password} name="password" onChange={handleChange} type="password" placeholder="Password" required />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="btn-submit-signup">
                            <p className="sign-in"> Sign In </p>
                        </Button>
                    </Form>
                    <p className="text-have-account">Don't have an account ? Klik <strong onClick={onClickHere} style={{ cursor: "pointer" }}>Here</strong> </p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalSignIn
