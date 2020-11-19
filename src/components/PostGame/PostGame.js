import React, { useState, useEffect } from 'react'
import './PostGame.css'
import Modal from '../Modal/Modal'

// Component to display post-game page
const PostGame = ({ participants, onClick, name }) => {
    const [error, setError] = useState('')
    const [winners, setWinners] = useState([])
    const [losers, setLosers] = useState([])
    

    //handle calculating winners and losers
    useEffect(() => {
        // find winner(s)
        let w = []
        let max = 0
        for (let i = 0; i < participants.length; i++) {
            if (participants[i].points >= max) {
                if (participants[i].points > max) {
                    w.length = 0
                    max = participants[i].points
                }
                w.push(participants[i])
                
            }
        }
        for (let i=0; i<w.length; i++) {
            if (w[i].name === name) {
                let duration = 2000
                let animationEnd = Date.now() + duration
                let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
    
                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min
                }
    
                let interval = setInterval(function() {
                    let timeLeft = animationEnd - Date.now()
    
                    if (timeLeft <= 0) {
                        return clearInterval(interval)  
                    }
    
                    let particleCount = 300 * (timeLeft / duration)
                    // since particles fall down, start a bit higher than random
                    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
                    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
                }, 250);
                break
            }
        }
        setWinners(() => w)

        // sort losers
        const sortedList = participants.sort(function (a, b) { return b.points - a.points })
        const loss = sortedList.filter((user) => {
            for (let j = 0; j < w.length; j++) {
                if (w[j].name === user.name) {
                    return false
                }
            }
            return true
        })
        setLosers(() => loss)
    }, [])

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