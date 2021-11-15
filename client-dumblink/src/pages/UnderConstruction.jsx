import React from 'react'
import TrafficBarrier from '../assets/traffic-barrier.png'

const UnderConstruction = () => {
    return (
        <div
            style={{
                width: "700px",
                marginTop: "100px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                fontSize: "40px",
                fontWeight: "500",
                textAlign: "center"
            }}>
            <img src={TrafficBarrier} style={{ width: "200px", height: "auto", marginBottom: "50px" }} alt="Icons" /> <br />
            Sorry About That, <br />
            This Page Is Under Construction
        </div>
    )
}

export default UnderConstruction
