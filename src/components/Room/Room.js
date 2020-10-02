import React, { useState, useEffect } from 'react';

const Room = ({ 
    info, 
    participants, 
    myTurn, 
    onClick, 
    time,
    setTime, 
    setNextTurn,
    round,
    setReset, 
    canvas
}) => {
    const TIME = 10
    const [button, setButton] = useState('')
    const [counter, setCounter] = useState(TIME);
    useEffect(() => {
        if (myTurn === true) {
            setButton(() =>
            <button className="btn btn-primary btn-lg btn-block" 
            type="button"
            onClick={event => {
                    event.preventDefault();
                    onClick();
                }
            }
            >Skip</button>)
        } else {setButton(() => '')}  
    }, [myTurn, onClick])
    
    useEffect(() => {
        if (time === true && counter < TIME) {
            setCounter(TIME);
            setReset(true)
            setTime(false);
        } else if (counter === 0 && myTurn === true) {
            setNextTurn(true);
            setReset(true)    
        }
        else if (counter === 0) {
            setCounter(TIME);
            setReset(true)
        } 
        else {
          counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);  
        }  
    }, [counter, time, myTurn, setNextTurn, setTime, setReset]);
    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-lg-5">
                        <h1>{info}</h1>
                    </div>
                    <div className="col-lg-2">
                        {button}
                    </div>
                    <div className="col-lg-3">
                        <h1>Time left: {counter}</h1>
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