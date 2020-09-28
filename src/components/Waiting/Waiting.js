import React, { useState } from 'react';

const Waiting = ({ participants, name, room, onClick }) => {
    const [error, setError] = useState('')
    
    return (
            <div className="outerContainer d-flex align-items-center min-vh-100">
                <div className="container">
                    <div className="mainHeader row justify-content-center">
                        <div className="col-10 text-center line">
                            <h1><span className="text-capitalize">{name}</span>, welcome to the waiting area for room <span className="text-capitalize">{room}</span></h1>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-8 text-center">
                                {participants.map((val) => {
                                        return (
                                            <h2 key={'id' + val.id} id={'id' + val.id} className="info mb-3 text-capitalize">{val.name}</h2>
                                        )
                                    
                                })}
                        </div>
                    </div>
                    <div id="form" className="row justify-content-center">
                        <form className="col-10 form-signin line">
                            <div className="error text-center">
                                <p>{error ? participants.length < 2 : null}</p>
                            </div>
                            <button 
                                className="btn btn-primary btn-lg btn-block" 
                                type="submit"
                                onClick={event => {
                                        event.preventDefault()
                                        if (participants.length >= 2) {
                                            onClick()
                                        } else {
                                            setError('Need at least two players')
                                        }
                                    }
                                }
                                >Start Game</button>
                        </form>
                    
                    </div>
                </div>
            </div>
    )
}

export default Waiting