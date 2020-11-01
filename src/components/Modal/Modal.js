import React from 'react'

const Modal = () => {
    return (
        <div className="modal fade" id="howToPlay" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">How to Play</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Create a Room</h6>
                                <p>Choose an emoji avatar and type in a temporary username. The room name can be left as is or you can change it.</p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Join a Room</h6>
                                <p>if your friend as sent you a link that looks something like this: https://picto.netlify.app/join?room=room-name, click on the link and you will
                                    see that the room field is already filled in. You just need to choose an emoji avatar and a temporary username.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Waiting room</h6>
                                <p>Once you click on Join, you will be in your waiting room. Wait until everyone is there and decide who will go first. 
                                    That person can click on start game. <span className="text-uppercase">Only one person should click on start game.</span>
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Playing - Your Turn</h6>
                                <p>You will have 3 words to pick from and 5 seconds to choose, first word is picked as default. 
                                    Once picked, you have 30 seconds to draw that word. You will not be able to guess your own word. Do not use the word in your drawing.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Playing - Guessing</h6>
                                <p>
                                    As they draw, you may guess the word via the chat input field. Admin will let you know if it is correct or not. 
                                    If it is not correct, everyone else will see your incorrect word. If it is correct, no one else will see the word.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Playing - After each turn</h6>
                                <p>
                                    After each turn, admin will let you know the correct word in the chat. A random player will be chosen for the next turn. 
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Scores</h6>
                                <p>
                                    The total score is dependent on the number of players i.e. 10 players = total score of 1000. The first player to guess correct will get the highest score of 1000, the second will get 900 and so on.
                                    Scores are always visible during play (Might need to scroll to the bottom of the page on mobile devices).
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Game over</h6>
                                <p>
                                    Once game is over, you will be taken to a page that shows you everyone's scores and the winner(s).
                                    <span className="text-upercase">One</span> person can click on the play again button to play another game.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h6>Leaving</h6>
                                <p>
                                    You may leave the room by closing the tab or window. Once everyone has left, the room will be destroyed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Modal