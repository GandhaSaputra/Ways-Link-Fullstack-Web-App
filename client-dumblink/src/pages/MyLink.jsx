import React, { useContext, useState, useEffect } from 'react'
import { Container, Button, Row, Col, Modal } from 'react-bootstrap'
import LeftSide from '../components/LeftSide'
import Navbar from '../components/Navbar'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import imageLink from '../assets/imagelink.png'
import { useHistory } from 'react-router'
import { UserContext } from '../config/UserContext'
import { API } from '../config/API'

function MyLink() {
    const history = useHistory();
    const title = "My Link"

    const [state, dispatch] = useContext(UserContext);
    const [brands, setBrands] = useState([])

    const isLogin = state.isLogin

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleCloseModal = () => setShowModalDelete(false);
    const handleShowModal = () => setShowModalDelete(true);

    const handleClickDetail = (uniqueLink) => {
        history.push(`/link-content/${uniqueLink}`)
    }

    const handleEditBrand = () => {
        history.push('/under-construction')
        // history.push(`/detail-brand/${uniqueLink}`)
    }

    const handleDelete = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            await API.delete("/brand/" + id, config)
            getBrands()
            handleCloseModal()
        } catch (error) {
            console.log(error)
        }

    }


    const getBrands = async () => {
        const response = await API.get("/brands")
        setBrands(response.data.data)
    }

    useEffect(() => {
        getBrands();
    }, [])


    return (
        <div>
            <Navbar title={title} isLogin={isLogin} />
            <div className="body-template">
                <LeftSide />
                <div fluid className="right-side-body">
                    {/* <div className="searchbar-box">
                        <div className="search-bar-title">
                            <div className="all-links-wrapper">
                                <p className="seacrh-bar-text-all-links">All Links</p>
                            </div>
                            <div className="total-links-wrapper">
                                <p className="total-links">1</p>
                            </div>
                        </div>
                        <input type="text" />
                        <Button>Seacrh</Button>
                    </div> */}
                    <Container className="mylink-items">
                        {brands.map((data, index) => (
                            <Row key={index}>
                                <Col sm={2} className="col-links">
                                    <img src={data?.image} alt="test" className="image-website-mylink" />
                                </Col>
                                <Col sm={4} className="col-links">
                                    <div className="text-link-title-group">
                                        <p className="website-text">{data?.title}</p>
                                        <p className="link-url">{data?.description}</p>
                                    </div>
                                </Col>
                                <Col sm={3} className="col-links">
                                    <div className="text-visit-group">
                                        <p className="visit-number">{data.viewCount}</p>
                                        <p className="visit-text">Visit</p>
                                    </div>
                                </Col>
                                <Col sm={3} className="col-links">
                                    <div className="group-action-link">
                                        <BsFillEyeFill style={{ cursor: "pointer" }} size={30} onClick={() => handleClickDetail(data?.uniqueLink)} />
                                        <FaRegEdit style={{ cursor: "pointer" }} onClick={() => handleEditBrand()} size={30} />
                                        <FaRegTrashAlt size={30} onClick={handleShowModal} style={{ cursor: "pointer" }} />
                                    </div>
                                </Col>
                                <Modal show={showModalDelete} onHide={handleCloseModal} centered key={index}>
                                    <Modal.Body>
                                        <p className="text-modal-delete">You are sure to delete this link?</p>
                                        <div className="btn-group-modal-delete">
                                            <Button variant="danger" onClick={() => handleDelete(data?.id)}>Delete</Button>
                                            <Button variant="success">Cancel</Button>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </Row>
                        ))}

                    </Container>
                </div>
            </div>

        </div>
    )
}

export default MyLink
