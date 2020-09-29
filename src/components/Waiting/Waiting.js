import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './Waiting.css'

const Waiting = ({ participants, name, room, onClick }) => {
    const [error, setError] = useState('')
    const [successCopy, setSuccessCopy] = useState(false)
    
    return (
            <div className="outerContainer d-flex align-items-center min-vh-100">
                <div className="container">
                    <div className="mainHeader row justify-content-center">
                        <div className="col-10 text-center line">
                            <h1 className="text-break">Hello <span className="text-capitalize">{name}</span></h1>
                        </div>
                    </div>
                    <div className="copy row justify-content-center">
                        <div className="info col-10 text-center">
                            <p role="button" onClick={() =>  
                                {
                                   navigator.clipboard.writeText(`localhost:3000/join?room=${room}`);
                                   setSuccessCopy(true)
                                }
                            }>
                                <FontAwesomeIcon className="mr-1" icon={faCopy} />Click here to copy and share this link with friends:  
                                 <u className="ml-1">localhost:3000/join?room={room}</u><span><br/>{successCopy == true ? 'Copied!' : null}</span></p>
                            
                            
                        </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-8 text-center">
                            <p className="info lead">Players:</p>
                                {participants.map((val) => {
                                        return (
                                            <h2 key={'id' + val.id} id={'id' + val.id} className="info mb-3 text-capitalize text-break">{val.name}</h2>
                                        )
                                    
                                })}
                        </div>
                    </div>
                    <div id="form" className="row justify-content-center">
                        <form className="col-10 form-signin line">
                            <div className="error text-center">
                                <p>{participants.length < 2 ? error : null}</p>
                            </div>
                            <button 
                                className="btn btn-primary btn-lg btn-block" 
                                type="submit"
                                onClick={event => {
                                        event.preventDefault()
                                        if (participants.length >= 2) {
                                            onClick()
                                        } else {
                                            setError('Need at least two players');
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