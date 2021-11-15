import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import dummyImage from '../assets/dummyImage.png'
import { API } from '../config/API';
import { UserContext } from '../config/UserContext'

function LinkContent() {
    const { uniqueLink } = useParams()
    const [state] = useContext(UserContext);
    const [dataBrand, setDataBrand] = useState(null)

    const getLinks = async () => {
        const responses = await API.get(`/brand/${uniqueLink}`)
        setDataBrand(responses.data.data)
    }

    const handleClick = (id) => {
        API.get(`/visitCount/${id}`)
    }

    useEffect(() => {
        getLinks()
    }, [])

    return (
        <div>
            <Container className="container-link-content">
                <img src={dataBrand?.image} alt="dummy" className="dummy-image-link-items" />
                <p className="brand-name-text" style={{ fontSize: 30, fontWeight: "600", textAlign: "center", marginLeft: 20, marginTop: 30 }}>
                    {dataBrand?.title}
                </p>
                <p className="link-content-long-text">
                    {dataBrand?.description}
                </p>
                {dataBrand?.links?.map((item, index) => {
                    console.log(item?.brandId)
                    return (
                        <a href={item?.url} target="#" onClick={() => { handleClick(item?.brandId) }} className="link-content-items">
                            <div >
                                <img src={item?.image} alt="" className="image-link-content" />
                                <p className="website-link-content" style={{ color: "#fff", fontSize: "20px" }}>{item?.title}</p>
                            </div>
                        </a>
                    )
                })}
            </Container>
        </div>
    )
}

export default LinkContent
