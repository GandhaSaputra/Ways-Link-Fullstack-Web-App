import React, { useContext, useEffect, useState } from 'react'
import { Container, Button, Form } from 'react-bootstrap'
import { Redirect, useHistory } from 'react-router'
import LeftSide from '../components/LeftSide'
import Navbar from '../components/Navbar'
import { UserContext } from '../config/UserContext'
import { API } from '../config/API'

function ProfilePage() {
    const title = "Profile"
    let history = useHistory();
    const [state, dispatch] = useContext(UserContext);
    const [dataUser, setDataUser] = useState(null)
    const [nameForm, setNameForm] = useState({
        name: "",
    })
    const isLogin = state.isLogin

    const handleChange = (e) => {
        setNameForm({
            ...nameForm,
            name: e.target.value
        })
    }

    const getUserData = async () => {
        const response = await API.get(`/get-user`)
        setDataUser(response?.data?.data)
        setNameForm({
            name: response.data.data.name
        })
    }

    const deleteAccount = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            await API.delete(`/delete-user/${state?.user?.id}`, config)
            dispatch({
                type: "LOGOUT"
            })
            history.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaveAccount = async (e) => {
        try {
            e.preventDefault();
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const formData = {
                name: nameForm.name
            }

            await API.patch(`/profile-update/${state?.user?.id}`, formData, config);
            getUserData();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <div>
            <Navbar title={title} isLogin={isLogin} />
            <div className="body-template">
                <LeftSide />
                <div fluid className="right-side-body">
                    <p className="text-my-information">My Information</p>
                    <Form onSubmit={handleSaveAccount}>
                        <Container className="container-profile">
                            <Form.Group className="input-profile-group">
                                <Form.Label className="title-name-profile">Name</Form.Label>
                                <Form.Control type="text" value={nameForm?.name} name="name" onChange={handleChange} className="attributes-profile" />
                            </Form.Group>
                            <Form.Group className="input-profile-group">
                                <Form.Label className="title-email-profile">Email</Form.Label>
                                <Form.Control disabled value={dataUser?.email} className="attributes-profile" />
                            </Form.Group>
                        </Container>
                        <div className="btn-group-profile">
                            <Button type="submit" variant="warning" className="buttons-profile">Save Account</Button>
                            <Button onClick={deleteAccount} className="buttons-profile" variant="danger">Delete Account</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
