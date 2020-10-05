import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import './Room.css'

const Room = ({ 
    info, 
    participants, 
    myTurn, 
    onClick,
    word1,
    word2,
    word3,
    choosing, 
    resetTime,
    setResetTime,
    round,
    setReset, 
    canvas
}) => {
    const TIME = 5
    const [button, setButton] = useState('')
    const [counter, setCounter] = useState(TIME);
    const [showSpinner, setShowSpinner] = useState(false)

    useEffect(() => {
        if (myTurn === true && choosing === true) {
            setButton(() =>
            <div>
              <button className="btn btn-primary btn-lg btn-block" 
            type="button"
            onClick={event => {
                    event.preventDefault();
                    onClick(word1);
                    setShowSpinner(true)
                }
            }
            >{word1}</button>
            <button className="btn btn-primary btn-lg btn-block" 
            type="button"
            onClick={event => {
                    event.preventDefault();
                    onClick(word2);
                    setShowSpinner(true)
                }
            }
            >{word2}</button>
            <button className="btn btn-primary btn-lg btn-block" 
            type="button"
            onClick={event => {
                    event.preventDefault();
                    onClick(word3);
                    setShowSpinner(true)
                }
            }
            >{word3}</button>
            </div>
            )
        } else {
            setButton(() => '')
            setShowSpinner(false)
        }  
    }, [myTurn, onClick, choosing, word1, word2, word3])
    
    useEffect(() => {
        if (resetTime === true) {
            setResetTime(false);
            setCounter(TIME);
            setReset(true);
        } else if (choosing === false) {
          counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);  
        }  
    }, [counter, resetTime, setResetTime, setReset, choosing]);
    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-lg-4">
                        <h1>
                            {info}
                            {showSpinner ===  true ? (<FontAwesomeIcon icon={faPencilAlt} className="spinner" />) : null}
                        </h1>
                    </div>
                    <div className="col-lg-4">
                        {button}
                    </div>
                    <div className="col-lg-2">
                        <h1>
                        Time left: {counter}
                        </h1>
                    </div>
                    <div className="col-lg-2">
                        <h1>Round: {round}</h1>
                    </div>
                </div>
                <div className="mainHeader row justify-content-center">
                    <div className="col-lg-6">
                        <p>Canvas Controls</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div id="canvas" className="col-lg-6">
                        {canvas}
                    </div>
                    <div className="header col-lg-3">
                        <h2>Participants</h2>
                    </div>
                    <div className="header col-lg-3">
                        <h2>Chat</h2>
                    </div>

                </div>
            </div>
            </div>
    )
}

export default Room;