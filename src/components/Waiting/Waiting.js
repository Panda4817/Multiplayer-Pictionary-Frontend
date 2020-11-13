import React, { useReducer, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import './Waiting.css'
import Modal from '../Modal/Modal'
var parser = require('ua-parser-js')

// Component renders waiting room page
const Waiting = ({ participants, name, room, avatar, onClick }) => {
    // States to handle page functions (display errors, copy url, display device specific messages)
    const [error, setError] = useState('')
    const [successCopy, setSuccessCopy] = useState(false)
    const user = parser(navigator.userAgent)


    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-10 text-center line">
                        <h1 className="text-break appName">{String.fromCodePoint(avatar) + " "}<span className="text-capitalize">{name}</span></h1>
                    </div>
                </div>
                <div className="copy row justify-content-center">
                    <div className="info col-10 text-center">
                        <p role="button" onClick={() => {
                            navigator.clipboard.writeText(`https://picto.netlify.app/join?room=${room}`)
                            setSuccessCopy(true)
                        }
                        }>
                            <FontAwesomeIcon className="mr-1" icon={faCopy} />Click here to copy and share this link with friends:
                                 <u className="ml-1">https://picto.netlify.app/join?room={room}</u><span><br />{successCopy === true ? 'Copied!' : null}</span></p>


                    </div>
                </div>
                <div className="info row justify-content-center">
                    <div className="col-10 text-center">
                        <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#howToPlay">
                            How to play
                        </button>
                        <Modal />
                    </div>
                </div>
                <div className="info row justify-content-center">
                        <div className="col-10 text-center">
                            <p>{user.browser.name === 'Safari' || user.browser.name === 'Mobile Safari' ? "Not seeing everyone in the room? Try refreshing the page." : null}</p>
                        </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-8 text-center">
                        <p className="info lead">Players:</p>
                        {participants.map((val) => {
                            return (
                                <h2 key={'id' + val.id} id={'id' + val.id} className="info mb-3 text-capitalize text-break">{String.fromCodePoint(val.avatar) + " "}{val.name}</h2>
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