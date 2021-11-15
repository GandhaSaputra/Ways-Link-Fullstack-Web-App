import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Col } from 'react-bootstrap'
import LeftSide from '../components/LeftSide'
import Navbar from '../components/Navbar'
import DummyImage from '../assets/dummyImage.png'
import { UserContext } from '../config/UserContext'
import { API } from '../config/API'
import { useHistory, useParams } from 'react-router'
import template from '../components/template/template'

function DetailTemplatePage() {

    const { id } = useParams();

    const [templatePhone, setTemplatePhone] = useState(null)

    let history = useHistory()
    const [state] = useContext(UserContext);
    const isLogin = state.isLogin
    const title = "Template"
    const [preview, setPreview] = useState(null);

    const [previewLinkCover, setPreviewLinkCover] = useState([{ image: "" }])

    const [brandForm, setBrandForm] = useState({
        title: "",
        description: "",
        image: "",
    });

    const [addLinkForm, setAddLinkForm] = useState([
        {
            title: "",
            url: "",
            image: "",
        },
    ])

    const handleChangeLink = (e, index) => {
        const newLinks = [...addLinkForm]
        if (e.target.name === "title") {
            newLinks[index].title = e.target.value
        } else if (e.target.name === "url") {
            newLinks[index].url = e.target.value
        }

        setAddLinkForm(newLinks)
    }

    const handleImageLink = (e, index) => {
        let imageLinks = [...addLinkForm]
        imageLinks[index].image = e.target.files
        setAddLinkForm(imageLinks)

        const previewLinks = [...previewLinkCover]
        previewLinks[index].image = URL.createObjectURL(e.target.files[0])
        setPreviewLinkCover(previewLinks)
    }


    const handleClickAddNewLink = () => {
        const value = [...addLinkForm]
        value.push({
            title: "",
            url: "",
            image: "",
        })
        setAddLinkForm(value)

        previewLinkCover.push({ image: "" })
    }

    const handleChangeBrand = (e) => {
        setBrandForm({
            ...brandForm,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        })
        if (e.target.name === "image") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleRemoveLinkForm = (e, index) => {
        setAddLinkForm(
            addLinkForm.filter((item, sIndex) => index !== sIndex)
        )
        setPreviewLinkCover(
            previewLinkCover.filter((i, sIndex) => index !== sIndex)
        )
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let dataForm = new FormData()
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            };
            dataForm.set('imageBrand', brandForm.image[0], brandForm.image[0].name)
            addLinkForm.map(async (item) => {
                await dataForm.append('imageLink', item?.image[0])
            })

            addLinkForm.map((item) => {
                dataForm.append('titleLink', item?.title)
            })

            addLinkForm.map((item) => {
                dataForm.append('url', item?.url)
            })

            dataForm.set('title', brandForm?.title)
            dataForm.set('description', brandForm?.description)
            await API.post('/brand', dataForm, config)
            history.push('/my-link')
        } catch (error) {
            console.log(error)
        }
    }

    console.log(templatePhone)

    useEffect(() => {
        if (template.length > 0) {
            const tmp = template.find((item) => item.id === parseInt(id))
            setTemplatePhone(tmp)
        }
    }, [])

    return (
        <div>
            <Navbar isLogin={isLogin} title={title} />
            <div fluid className="body-template">
                <LeftSide />
                <div fluid className="right-side-body">
                    <img src={templatePhone?.imagePhone} alt="PhoneImage" className="phone-image-detail-template" />
                    <p className="title-create-link">Create Link</p>
                    <div className="container-create-link">
                        <Form >
                            {preview && (
                                <div>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: "100px",
                                            maxHeight: "100px",
                                            objectFit: "cover",
                                            position: "absolute",
                                            left: "50px",
                                            top: "20px"
                                        }}
                                        alt="previewBrand"
                                    />
                                </div>
                            )}
                            <Form.Group>
                                <Form.Label
                                    className="upload-file-label"
                                    for="inputFileBrand"
                                >
                                    Upload
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    hidden
                                    id="inputFileBrand"
                                    name={`image`}
                                    onChange={handleChangeBrand}
                                />
                            </Form.Group>
                            <Form.Group className="input-title-link">
                                <Form.Label
                                    className="input-title-link-label"
                                    for="inputTitle"
                                >
                                    Title
                                </Form.Label>
                                <Form.Control
                                    placeholder="ex. Your Title"
                                    value={brandForm.title}
                                    name="title"
                                    onChange={handleChangeBrand}
                                    type="text"
                                    id="inputTitle" />
                            </Form.Group>
                            <Form.Group className="input-url-link">
                                <Form.Label
                                    className="input-title-link-label"
                                    for="inputTitle"
                                >
                                    Description
                                </Form.Label>
                                <Form.Control
                                    placeholder="ex. Your Description"
                                    value={brandForm.description}
                                    name="description"
                                    onChange={handleChangeBrand}
                                    type="text"
                                    id="inputTitle" />
                            </Form.Group>
                            {addLinkForm.length < 5 ? (
                                <Button
                                    variant="warning"
                                    onClick={handleClickAddNewLink}
                                    style={{ marginLeft: "200px", color: "#fff" }}
                                >
                                    Add New Link
                                </Button>
                            ) : (
                                <></>
                            )}


                            {addLinkForm.map((data, index) => (
                                <Col className="link-item-create-item" key={index}>
                                    {previewLinkCover[index]?.image !== "" ? (
                                        <img
                                            src={previewLinkCover[index]?.image}
                                            alt="Link Cover Preview"
                                            className="dummy-image-link-items" />
                                    ) : (
                                        <img
                                            src={DummyImage}
                                            alt="Link Cover"
                                            className="dummy-image-link-items" />
                                    )}
                                    <Form.Group>
                                        <Form.Label htmlFor={`fileLinkCover${index}`} className="label-upload-link-cover">
                                            Upload
                                        </Form.Label>
                                        <Form.Control
                                            id={`fileLinkCover${index}`}
                                            type="file"
                                            hidden
                                            name={`image${index}`}
                                            onChange={(e) => handleImageLink(e, index)} />
                                    </Form.Group>
                                    <Form.Group className="link-item-desc-group">
                                        <Form.Label className="title-name-link">
                                            Title Link
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="attributes-profile"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) => handleChangeLink(e, index)} />
                                    </Form.Group>
                                    <Form.Group className="link-item-desc-group-dua">
                                        <Form.Label className="title-url-link">
                                            Link
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="attributes-profile-url"
                                            name="url"
                                            value={data.url}
                                            onChange={(e) => handleChangeLink(e, index)} />
                                    </Form.Group>
                                    <span onClick={(e) => handleRemoveLinkForm(e, index)} className="remove-link-form">X</span>
                                </Col>
                            ))}
                        </Form>
                    </div>
                    <Button onClick={handleOnSubmit} variant="warning" className="btn-publish">Publish Link</Button>
                </div>
            </div>
        </div>
    )
}

export default DetailTemplatePage