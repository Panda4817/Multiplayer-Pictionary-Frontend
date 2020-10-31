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

    // Chat variables
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    // Drawing variables
    const [data, setData] = useState(null)
    const [reset, setReset] = useState(false)
    const [colour, setColour] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(5)


    const ENDPOINT = 'https://multiplayer-pictionary.herokuapp.com'
    //const ENDPOINT = 'http://localhost:5000'
    useEffect(() => {
        const { name, room, avatar } = queryString.parse(location.search)
        setName(name.toLowerCase())
        setRoom(room.toLowerCase())
        setAvatar(avatar)
        console.log(avatar)
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

    useEffect(() => {
        socket.on('updateUsers', (users) => {
            updateParticipants(() => users)

        })
    }, [participants])

    useEffect(() => {
        socket.on('waitingFalse', () => {
            setWaiting(false)
        })
        socket.on('waitingTrue', () => {
            setWaiting(true)
        })
    }, [waiting])

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

    useEffect(() => {
        socket.on('choosing', ({ chosen, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setChoosing(true)
            setMyTurn(false)

        })
        socket.on('choice', ({ chosen, word1, word2, word3, round }) => {
            setRound(() => round)
            setChosen(() => chosen)
            setMyTurn(true)
            setChoosing(true)
            setWord1(word1)
            setWord2(word2)
            setWord3(word3)

        })
    }, [chosen])

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

    useEffect(() => {
        socket.on('gameOver', () => {
            setGameOver(true)
        })
    }, [gameOver])

    useEffect(() => {
        socket.on('resetTime', () => {
            setResetTime(true)
            console.log("reset time event received", new Date().toLocaleTimeString())
        })
    }, [])

    useEffect(() => {
        socket.on('draw_line', function (data) {
            setData(() => data)
        })
    }, [data])

    useEffect(() => {
        socket.on('spinner', () => {
            setSpinner(true)
        })
    }, [spinner])

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message])
        })
    }, [])

    useEffect(() => {
        socket.on('reset', () => {
            setGameOver(false)
            setColour("#000000")
            setLineWidth(5)
        })
    })

    useEffect(() => {
        socket.on('clear', () => {
            setReset(true)
        })
    }, [])

    const gameStart = () => {
        console.log("game started")
        setGameOver(false)
        setWaiting(false)
        setColour("#000000")
        setLineWidth(5)
        socket.emit('changeWaiting', room)
        socket.emit('gameStart', room)


    }

    const newWord = (word) => {
        socket.emit('chosenWord', { word, room })
    }

    const emitDrawing = (data) => {
        socket.emit('emitDrawing', { data, room })
    }

    const sendMessage = (event) => {
        event.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    const changeColour = (colour) => {
        setColour(colour)
    }

    const changeWidth = (num) => {
        setLineWidth(num)
    }

    const clearCanvas = () => {
        setReset(true)
        socket.emit('clear', room)
    }


    if (error !== "" && error !== undefined) {
        return (
            <Redirect to={`/join?room=${room}&error=${error}`} />
        )
    } else if (waiting === true) {
        return (
            <Waiting participants={participants} name={name} room={room} avatar={avatar} onClick={gameStart} />
        )
    } else if (waiting === false && gameOver === false) {
        return (
            <Room
                name={name}
                info={info}
                avatar={avatar}
                participants={participants}
                myTurn={myTurn}
                onClick={newWord}
                word1={word1}
                word2={word2}
                word3={word3}
                choosing={choosing}
                resetTime={resetTime}
                setResetTime={setResetTime}
                round={round}
                setReset={setReset}
                spinner={spinner}
                controls={
                    <Controls
                        changeColour={changeColour}
                        clearCanvas={clearCanvas}
                        changeWidth={changeWidth}
                        controlsDisable={myTurn === true ? false : true}
                        lineWidth={lineWidth}
                    />
                }
                canvas={
                    <Canvas
                        canvasDisable={myTurn === true ? false : true}
                        reset={reset}
                        setReset={setReset}
                        emitDrawing={emitDrawing}
                        data={data}
                        waiting={waiting}
                        colour={colour}
                        lineWidth={lineWidth}
                    />
                }
                messagesList={
                    <Messages messages={messages} name={name} avatar={avatar} />
                }
                input={
                    <Input
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        disable={myTurn}
                    />
                }
            />
        )
    } else if (gameOver === true) {
        return (
            <PostGame
                participants={participants}
                onClick={gameStart}
            />
        )
    }

}

export default Game