import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router';
import { UserContext } from '../config/UserContext';
import Navbar from '../components/Navbar'
import template from '../components/template/template'
import PhoneImg from '../assets/Phone.png'
import PhoneImgDua from '../assets/PhoneDua.png'
import PhoneImgTiga from '../assets/PhoneTiga.png'
import PhoneImgEmpat from '../assets/PhoneEmpat.png'
import LeftSide from '../components/LeftSide';

function TemplatePage() {
    const title = "Template"
    const history = useHistory()

    const [state, dispatch] = useContext(UserContext);

    const isLogin = state.isLogin

    const handleClick = (id) => {
        history.push(`/detail-template/${id}`)
    }

    return (
        <div>
            <Navbar title={title} isLogin={isLogin} />
            <div className="body-template">
                <LeftSide />
                <div fluid className="right-side-body">
                    <div className="phone-images-group">
                        {template.map((item, index) => (
                            <img key={index} src={item.imagePhone} alt="PhoneSatu" className="phone-images-template" onClick={() => handleClick(item.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplatePage
