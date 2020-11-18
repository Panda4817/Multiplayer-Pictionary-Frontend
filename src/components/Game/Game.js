import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import { Redirect } from 'react-router-dom'
import Waiting from '../Waiting/Waiting'
import Room from '../Room/Room'
import Canvas from '../Canvas/Canvas'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import PostGame from '../PostGame/PostGame'
import Controls from '../Controls/Controls'

let socket

const Game = ({ location }) => {
    // Room variables
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [avatar, setAvatar] = useState('')
    const [participants, updateParticipants] = useState([])
    const [error, setError] = useState('')
    const [waiting, setWaiting] = useState(true)

    // Game variables
    const [round, setRound] = useState(1)
    const [info, setInfo] = useState('')
    const [myTurn, setMyTurn] = useState(false)
    const [chosen, setChosen] = useState('')
    const [word, setWord] = useState('')
    const [word1, setWord1] = useState('')
    const [word2, setWord2] = useState('')
    const [word3, setWord3] = useState('')
    const [choosing, setChoosing] = useState(false)
    const [resetTime, setResetTime] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [guessCorrect, setGuessCorrect] = useState(false)

    // Chat variables
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    // Drawing variables
    const [data, setData] = useState(null)
    const [reset, setReset] = useState(false)
    const [colour, setColour] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(5)
    const [undo, setUndo] = useState(false)

    // URL of back end hosted on heroku
    const ENDPOINT = 'https://multiplayer-pictionary.herokuapp.com'

    // Localhost URL used for testing
    //const ENDPOINT = 'http://localhost:5000'

    // Handles refresh of page, joining and disconnecting of players to game room
    useEffect(() => {
        const { name, room, avatar } = queryString.parse(location.search)
        setName(name.trim().toLowerCase())
        setRoom(room.trim().toLowerCase())
        setAvatar(avatar)
        socket = io(ENDPOINT)
        socket.emit('join', { name, room, avatar }, (error) => {
            if (error !== null) {
                setError(error)
            }

        })

        return () => {

            socket.emit('disconnect')
            socket.off()
        }

    }, [ENDPOINT, location.search])

    // Handles updating player lists, including scores
    useEffect(() => {
        socket.on('updateUsers', (users) => {
            updateParticipants(() => users)

        })
    }, [participants])

    // Handles changing from waiting room to game room and vice versa
    useEffect(() => {
        socket.on('waitingFalse', () => {
            setWaiting(false)
        })
        socket.on('waitingTrue', () => {
            setWaiting(true)
        })
    }, [waiting])

    // Handles turn logic when new word received
    useEffect(() => {
        socket.on('turn', ({ chosen, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setChoosing(false)
            setWord(() => '')
            setMyTurn(false)
        })
        socket.on('myturn', ({ chosen, word, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setChoosing(false)
            setWord(() => word)
            setMyTurn(true)
        })
    }, [word])

    // Handles choice of words logic when new person is chosen to draw
    useEffect(() => {
        socket.on('choosing', ({ chosen, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setChoosing(true)
            setMyTurn(false)
            setMessage(() => '')
            setGuessCorrect(false)

        })
        socket.on('choice', ({ chosen, word1, word2, word3, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setMyTurn(true)
            setChoosing(true)
            setWord1(word1)
            setWord2(word2)
            setWord3(word3)
            setMessage(() => '')
            setGuessCorrect(false)

        })
    }, [chosen])

    // Handles the info string that is shown to each player in the game room
    useEffect(() => {
        if (waiting === true) {
            return
        }
        if (myTurn === true) {
            if (choosing === true) {
                setInfo(() => 'Choose a word')
            } else {
                setInfo(() => 'Word is ' + word)
            }

        } else if (chosen !== '') {
            if (choosing === true) {
                setInfo(() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + ' is choosing a word')
            } else {
                setInfo(() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + ' is drawing...')
            }

        }

    }, [choosing, word, myTurn, chosen, waiting])

    // Handles game over logic
    useEffect(() => {
        socket.on('gameOver', () => {
            setGameOver(true)
        })
    }, [gameOver])

    // Handles resetting the timer after each turn
    useEffect(() => {
        socket.on('resetTime', () => {
            setResetTime(true)
        })
    }, [])

    // Handles receiving drawing data
    useEffect(() => {
        socket.on('draw_line', function (data) {
            setData(() => data)
        })
    }, [data])

    // Handles when spinner is shown in the game room
    useEffect(() => {
        socket.on('spinner', () => {
            setSpinner(true)
        })
    }, [spinner])

    // Handles receiving messages in the chat
    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message])
            if (message['user'] === name) {
                if (message['text'].includes('correct')) {
                    setGuessCorrect(true)
                } else {
                    setGuessCorrect(false)
                }
            }
        })
    }, [name])

    // Handles canvas resetting
    useEffect(() => {
        socket.on('reset', () => {
            setGameOver(false)
            setColour("#000000")
            setLineWidth(5)
        })
    })

    // Handles clearing the canvas
    useEffect(() => {
        socket.on('clear', () => {
            setReset(true)
        })
    }, [])

    // Handles undo button for the canvas 
    useEffect(() => {
        socket.on('undo', () => {
            setUndo(true)
        })
    }, [])

    // Function to start the game and move to the game room
    const gameStart = () => {
        setGameOver(false)
        setWaiting(false)
        setColour("#000000")
        setLineWidth(5)
        socket.emit('changeWaiting', room)
        socket.emit('gameStart', room)
        window.scrollTo(0, 0)

    }

    // Function to emit chosen word from choice list
    const newWord = (word) => {
        socket.emit('chosenWord', { word, room })
    }

    // Function to emit drawing data by the player that is drawing
    const emitDrawing = (data) => {
        socket.emit('emitDrawing', { data, room })
    }

    // Function to emit messages sent
    const sendMessage = (event) => {
        event.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    // Function to change colour of brush
    const changeColour = (colour) => {
        setColour(colour)
    }

    // Function to handle change of line width
    const changeWidth = (num) => {
        setLineWidth(num)
    }

    // Function to handle clearing the canvas by emitting the event
    const clearCanvas = () => {
        setReset(true)
        socket.emit('clear', room)
    }

    // Function to undo lines on the canvas by emitting the event
    const undoCanvas = () => {
        setUndo(true)
        socket.emit('undo', room)
    }

    // Handle what to show on the page depending on where the player is- waiting room, game, post-game
    if (error !== "" && error !== undefined) {
        window.scrollTo(0, 0)
        return (
            <Redirect to={`/join?room=${room}&error=${error}`} />
        )
    } else if (waiting === true) {
        window.scrollTo(0, 0);
        return (
            <Waiting participants={participants} name={name} room={room} avatar={avatar} onClick={gameStart} />
        )
    } else if (waiting === false && gameOver === false) {
        return (
            <Room
                name={name} //pass username to game room
                info={info} //pass info string to game room to display
                avatar={avatar} //pass avatar unicode to game room to display
                participants={participants} //pass player list to extract information and display
                myTurn={myTurn} //pass if the player is the drawing person
                onClick={newWord} //pass the function to use when player clicks ona word to choose it
                word1={word1} //pass the 3 choice words
                word2={word2}
                word3={word3}
                choosing={choosing} //pass whether player is choosing a word or not (determines if timer should be running)
                resetTime={resetTime} //pass whether timer should reset
                setResetTime={setResetTime} //pass function, that resets timer so resetTime is not always true
                round={round} //pass the round number to game room to display
                setReset={setReset} //pass the setReset variable so canvas can reset at the same time the turn ends
                spinner={spinner} //pass the spinner variable that determines if the spinner should be shown
                guessCorrect={guessCorrect} // Change canvas border colour to visually tell you if the guess was right
                controls={
                    <Controls
                        changeColour={changeColour} //pass the function that handles changing of colour
                        clearCanvas={clearCanvas} //pass the function that handles clearing canvas
                        changeWidth={changeWidth} //pass the function that changes the width of the line
                        controlsDisable={myTurn === true ? false : true} //pass the variable that determines if the controls are disabled
                        lineWidth={lineWidth} //pass the current line width to the controls, so value of the control can be set
                        undoCanvas={undoCanvas} //pass the function that handles undoing lines drawn
                    />
                }
                canvas={
                    <Canvas
                        canvasDisable={myTurn === true ? false : true} //pass the variable that determines if the canvas is disabled
                        reset={reset} //pass the variable that determines if the canvas should be reset
                        setReset={setReset} //pass the function that resets the variable to false
                        emitDrawing={emitDrawing} //pass the function the emits drawing data using web sockets
                        data={data} //pass current drawing data received over web sockets
                        waiting={waiting} //pass the waiting variable, so if everyone gets kicked out, canvas can be reset
                        colour={colour} //pass current brush colour
                        lineWidth={lineWidth} //pass current brush line width
                        undo={undo} //pass undo variable to determine if lines should be erased
                        setUndo={setUndo} //pass the functions that resets that variable to false (so you don't keep erasing lines)
                    />
                }
                messagesList={
                    <Messages messages={messages} name={name} avatar={avatar} />
                }
                input={
                    <Input
                        message={message} //pass the current message to display in the input (used to set input value)
                        setMessage={setMessage} //pass the function to set the message state
                        sendMessage={sendMessage} //pass the function to emit the message sent
                        disable={myTurn} //pass the variable to disable the input field if drawing
                    />
                }
            />
        )
    } else if (gameOver === true) {
        window.scrollTo(0, 0)
        return (
            <PostGame
                participants={participants} //pass player data to display
                onClick={gameStart} //pass function to start the game again if clicked
            />
        )
    }

}

export default Game