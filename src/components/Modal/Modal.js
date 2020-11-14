import React from 'react'
import './Modal.css'

// Component to render a 'how to play' bootstrap modal
const Modal = () => {
    return (
        <div className="modal fade" id="howToPlay" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title " id="staticBackdropLabel">How to Play on Picto</h2>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Create a Room</h3>
                                <p>Choose an emoji avatar and type in a temporary username. The room name can be left as is or you can change it.</p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Join a Room</h3>
                                <p>if your friend as sent you a link that looks something like this: https://picto.netlify.app/join?room=room-name, click on the link and you will
                                    see that the room field is already filled in. You just need to choose an emoji avatar and a temporary username. 
                                    If your friends have already started playing, you can join an existing game, though the timer and round numbers won't update until the next turn.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Waiting room</h3>
                                <p>Once you click on Join, you will be in your waiting room. Wait there until everyone is in and then click on 'start game'.  
                                    <span className="text-uppercase">Only one person should click on 'start game'.</span> 
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Playing - Your Turn</h3>
                                <p>You will have 3 words to pick from and 5 seconds to choose, first word is picked as default. 
                                    Once picked, you have 30 seconds to draw that word. You will not be able to guess your own word. Do not use the word in your drawing. 
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Playing - Guessing</h3>
                                <p>
                                    As they draw, you may guess the word via the chat input field. Admin will let you know if it is correct or not. 
                                    If it is not correct, everyone else will see your incorrect word. If it is correct, no one else will see the word.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Playing - After each turn</h3>
                                <p>
                                    After each turn, admin will let you know the correct word in the chat. A random player will be chosen for the next turn. 
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Scores</h3>
                                <p>
                                    The total score is dependent on the number of players i.e. 10 players = total score of 1000. The first player to guess correct will get the highest score of 1000, the second will get 900 and so on.
                                    Scores are always visible during play (Might need to scroll to the bottom of the page on mobile devices). 
                                    The person drawing will also receive points dependent on how many people can guess the word correctly from their drawing. 100 points for each correct guess.
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Game over</h3>
                                <p>
                                    Once game is over, you will be taken to a page that shows you everyone's scores and the winner(s). 
                                    You can click on the 'play again' button to play another game. <span className="text-uppercase">Only one person should click the 'play again' button.</span>  
                                </p>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col">
                                <h3>Leaving</h3>
                                <p>
                                    You may leave the room by closing the tab or window. Once everyone has left, the room will be destroyed. 
                                    If a player leaves, then the game continues as normal. If that person was drawing, wait for their turn to end to continue as normal. 
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