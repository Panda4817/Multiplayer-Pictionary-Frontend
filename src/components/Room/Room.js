import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import './Room.css'

const Room = ({ 
    name,
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
    spinner,
    //nextTurnNow,
    //nextTurn,
    //gameOver,
    canvas,
    messagesList,
    input
}) => {
    const TIME = 30
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
        if (spinner === true) {
            setShowSpinner(true);
        }
    }, [spinner])
    
    useEffect(() => {
        if (resetTime === true) {
            console.log("reset react counter", new Date().toLocaleTimeString())
            setCounter(TIME);
            setReset(true);
            setResetTime(false);
        } else if (choosing === false && counter > 0) {
            const timer  = setTimeout(() => setCounter((counter) => counter - 1), 1000);
            return () => clearTimeout(timer); 
        } 
        
          
    }, [counter, resetTime, setResetTime, setReset, choosing]);

    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-lg-4">
                        <h1 className="text-center">
                        {info}
                        {showSpinner ===  true ? (<FontAwesomeIcon icon={faPencilAlt} className="spinner ml-5" />) : null}
                        </h1>
                        
                    </div>
                    <div className="col-lg-4">
                        {button}
                    </div>
                    <div className="col-lg-2 timer">
                        <h3 className="text-center">
                        Time left: {counter}
                        </h3>
                    </div>
                    <div className="col-lg-2 round">
                        <h3 className="text-center">Round: {round}</h3>
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
                        <div className="row justify-content-around">
                            <h2 className="text-center">
                                <FontAwesomeIcon icon={faComments} className="chatIcon mr-5" />
                                {myTurn === true ? "Guesses!" : "Guess!"}
                            </h2>
                        </div>
                        {messagesList}
                        {input}
                    </div>
                    <div className="header col-lg-3">
                        <h2 className="text-center">Current Players:</h2>
                        {participants.map((p) => {
                        return (
                            <div className="row justify-content-between" key={'id' + p.id} id={'id' + p.id}>
                                <h3 className={p.name === name ? "me" : "names" }>{p.name[0].toUpperCase() + p.name.slice(1)}</h3>
                                <p className="lead points">{p.points}</p>
                            </div>
                        ) 
                        })}
                    </div>
                    

                </div>
            </div>
            </div>
    )
}

export default Room;