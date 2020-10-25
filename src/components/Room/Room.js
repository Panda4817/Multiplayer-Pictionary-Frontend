import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import './Room.css'

const Room = ({
    name,
    info,
    avatar,
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
    controls,
    canvas,
    messagesList,
    input
}) => {
    const TIME = 30
    const [button, setButton] = useState('')
    const [counter, setCounter] = useState(TIME)
    const [showSpinner, setShowSpinner] = useState(false)
    const [startTime, setStartTime] = useState(new Date().getTime())

    useEffect(() => {
        if (myTurn === true && choosing === true) {
            setButton(() =>
                <div>
                    <button className="btn btn-primary btn-lg btn-block"
                        type="button"
                        onClick={event => {
                            event.preventDefault()
                            onClick(word1)
                            setShowSpinner(true)
                        }
                        }
                    >{word1}</button>
                    <button className="btn btn-primary btn-lg btn-block"
                        type="button"
                        onClick={event => {
                            event.preventDefault()
                            onClick(word2)
                            setShowSpinner(true)
                        }
                        }
                    >{word2}</button>
                    <button className="btn btn-primary btn-lg btn-block"
                        type="button"
                        onClick={event => {
                            event.preventDefault()
                            onClick(word3)
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
            setShowSpinner(true)
        }
    }, [spinner])

    useEffect(() => {
        if (resetTime === true) {
            console.log("reset react counter", new Date().toLocaleTimeString())
            setCounter(TIME)
            setStartTime(new Date().getTime())
            setReset(true)
            setResetTime(false)
        } else if (choosing === false && counter > 0) {
            const t = setTimeout(() => {
                const now = new Date().getTime()
                const diff = Math.floor((now - startTime) / 1000)
                if (diff > 0) {
                    setCounter(TIME - diff)
                }
            }, 1000)
            return () => clearTimeout(t)

        } else if (choosing === true) {
            setCounter(0)
        }


    }, [resetTime, choosing, counter, startTime, setReset, setResetTime])
    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="row justify-content-around">
                    <div className="col-lg-4">
                        <h1 className="text-center mainHeader">
                            {info}
                        </h1>
                    </div>
                    {showSpinner === true ? (<FontAwesomeIcon icon={faPencilAlt} className="spinner mx-auto my-auto col-lg-1 p-1" />) : null}
                    <div className="col-lg-3">
                        {button}
                    </div>
                    <div className="col-lg-2 timer mainHeader">
                        <h3 className="text-center">
                            Time left: {counter}
                        </h3>
                    </div>
                    <div className="col-lg-2 round mainHeader">
                        <h3 className="text-center">Round: {round}</h3>
                    </div>
                </div>
                <div className="mainHeader row justify-content-start">
                    <div className="col-lg-6">
                        {controls}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div id="canvas" className="col-lg-6">
                        {canvas}
                    </div>
                    <div className="col-lg-3">
                        <div className="row justify-content-around">
                            <h2 className="mainHeader text-center">
                                {myTurn === true ? "Guesses " : "Guess! "}
                                <FontAwesomeIcon icon={faComments} className="chatIcon" />
                            </h2>

                        </div>
                        {messagesList}
                        {input}
                    </div>
                    <div className="col-lg-3">
                        <h2 className="text-center mainHeader">Current Players:</h2>
                        {participants.map((p) => {
                            return (
                                <div className="row justify-content-between" key={'id' + p.id} id={'id' + p.id}>
                                    <h3 className={p.name === name ? "me" : "names"}>{String.fromCodePoint(p.avatar)}{" " + p.name[0].toUpperCase() + p.name.slice(1)}</h3>
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

export default Room