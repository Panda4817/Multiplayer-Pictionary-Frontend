import React, { useState } from 'react'
import './PostGame.css'
import Modal from '../Modal/Modal'

// Component to display post-game page
const PostGame = ({ participants, onClick }) => {
    const [error, setError] = useState('')

    // find winner(s)
    const winners = []
    let max = 0
    for (var i = 0; i < participants.length; i++) {
        if (participants[i].points >= max) {
            if (participants[i].points > max) {
                winners.length = 0
                max = participants[i].points
            }
            winners.push(participants[i])
        }
    }

    // sort losers
    const sortedList = participants.sort(function (a, b) { return b.points - a.points })
    const losers = sortedList.filter(user => {
        for (var i = 0; i < winners.length; i++) {
            if (winners[i].name === user.name) {
                return false
            }
        }
        return true
    })

    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-8 text-center line">
                        <h1 className="text-break">{winners.length > 1 ? "Tie between:" : "Winner:"}</h1>
                        {winners.map((p) => {
                            return (
                                <div className="row justify-content-between" key={'id' + p.id} id={'id' + p.id}>
                                    <h2 className="winner">{String.fromCodePoint(p.avatar)}{" " + p.name[0].toUpperCase() + p.name.slice(1)}</h2>
                                    <h2 className="winner">{p.points}</h2>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-8 text-center">
                        <p className="info lead">Scores:</p>
                        {losers.map((p) => {
                            return (
                                <div className="row justify-content-between" key={'id' + p.id} id={'id' + p.id}>
                                    <h3 className="loser">{String.fromCodePoint(p.avatar)}{" " + p.name[0].toUpperCase() + p.name.slice(1)}</h3>
                                    <h3 className="loser">{p.points}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id="form" className="row justify-content-center">
                    <form className="col-8 form-signin line">
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
                        >Play Again</button>
                    </form>

                </div>
                <div className="info row justify-content-center mt-2">
                    <div className="col-12 text-center">
                        <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#howToPlay">
                            How to play
                        </button>
                        <Modal />
                    </div>
                </div>
            </div>
        </div>
    )


}

export default PostGame