import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle, FaLink, FaBoxes, FaSignOutAlt } from "react-icons/fa";
import { UserContext } from '../config/UserContext'

function LeftSide() {

    const [state, dispatch] = useContext(UserContext);

    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT'
        })
    }
    return (
        <div fluid className="left-side">
            <div className="link-group-left-side">
                <Link to="/template" className="link-items"><FaBoxes /> Template</Link>
                <Link to="/profile" className="link-items"><FaUserCircle /> Profile</Link>
                <Link to="/my-link" className="link-items"><FaLink /> My Link</Link>
            </div>
            <div onClick={handleLogout} className="link-items logout"><FaSignOutAlt /> Logout</div>
        </div>
    )
}

export default LeftSide
