import React from 'react'

const ServiceUnavailableBanner = () => (
    <div className="alert alert-info text-center" role="alert">
        <h1 className="alert-heading">Update</h1>
        <p className="lead">{process.env.REACT_APP_MAIN_REASON}</p>
        <p className="lead">{process.env.REACT_APP_MORE_DETAIL}</p>
        <p className="lead">Source code is available on <a href="https://github.com/Panda4817/Multiplayer-Pictionary-Frontend" class="alert-link">GitHub</a> if you wish to run it yourself.</p>
        <p className="lead">Sorry for the inconvenience.</p>
    </div>
)

export default ServiceUnavailableBanner