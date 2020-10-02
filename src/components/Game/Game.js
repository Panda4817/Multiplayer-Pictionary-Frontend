import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import Waiting from '../Waiting/Waiting'
import Room from '../Room/Room'
import Canvas from '../Canvas/Canvas'

let socket;

const Game = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [participants, updateParticipants] = useState([])
    const [error, setError] = useState('');
    const [waiting, setWaiting] = useState(true);
    
    const [round, setRound] = useState(1);
    const [nextTurn, setNextTurn] = useState(false);
    const [info, setInfo] = useState('');
    const [myTurn, setMyTurn] = useState(false);
    const [points, setPoints] = useState([])
    const [time, setTime] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    
    const [playerStart, setPlayerStart] = useState(false);
    const [playerEnd, setPlayerEnd] = useState(false);
    const [playerMove, setPlayerMove] = useState(false);
    const [x, setX] = useState('')
    const [y, setY] = useState('')
    const [reset, setReset] = useState(false);

    
    const ENDPOINT = 'localhost:5000';
   
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        setName(name.toLowerCase());
        console.log(name)
        setRoom(room.toLowerCase());
        socket = io(ENDPOINT)
        socket.emit('join', { name, room }, (error) => {
            if (error !== null) {
                setError(error)
            }
           
        });
        return () => {
            socket.emit('disconnect', room);

            socket.off();
        }

    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('updateUsers', (users) => {
            updateParticipants(() => users);
            console.log(participants)
        })
    }, [participants])

    useEffect(() => {
        socket.on('waitingFalse', () => {
            setWaiting(false);
        })
    }, [waiting])

    useEffect(() => {
        socket.on('round', () => {
            let n = round + 1
            if (n > 5) {
                setGameOver(true);
            }
            setRound(() => n)
        })
    }, [round])

    useEffect(() => {
        if (nextTurn === true) {
            setNextTurn(false);
            console.log("turn logic started")
            if (round > 5) {
                setGameOver(true);
            }
            socket.emit('whoseTurn', {round, room}); 
        }
         
    }, [nextTurn, gameOver, room, round])

    useEffect(() => {
        socket.on('turn', ({ chosen, word }) => {
            if (name === chosen.name) {  
                setInfo(() => 'Word is ' + word);
                setMyTurn(true);
                setTime(true);
                console.log(name, word)
            } else {
                setInfo(() => chosen.name + ' is drawing...')
                setMyTurn(false)
                setTime(true);
                console.log(name, chosen.name)
            }
              
        })  
    }, [info, myTurn, time, name])

    useEffect(() => {
        socket.on('skipped', () => {
            setTime(true);
        })
    }, [time])

    useEffect(() => {
        socket.on('startDrawing', ({ x, y}) => {
            setPlayerStart(true)
            setPlayerEnd(false)
            setPlayerMove(false)
            setX(() => x)
            setY(()=> y)
        })
        socket.on('moveDrawing', ({ x, y}) => {
            setPlayerStart(false)
            setPlayerEnd(false)
            setPlayerMove(true)
            setX(() => x)
            setY(()=> y)
        })
        socket.on('endDrawing', () => {
            setPlayerStart(false)
            setPlayerEnd(true)
            setPlayerMove(false)
            setX(() => '')
            setY(()=> '') 
        })
    }, [playerStart, playerMove, playerEnd])

    const gameStart = () => {
        console.log("game started")
        setWaiting(false);
        socket.emit('changeWaiting', room);
        setNextTurn(true)
    }

    const newWord = () => {
        socket.emit('word', round);
    }

    const startDrawing = (x, y) => {
        socket.emit('startDrawing', {"x": x, "y": y})
    }

    const moveDrawing = (x, y) => {
        socket.emit('moveDrawing', {"x": x, "y": y})
    }

    const endDrawing = () => {
        socket.emit('endDrawing')
    }


    if (error !== "" && error !== undefined) {
        return (
            <Redirect to={`/join?room=${room}&error=${error}`} />
        )
    } else if (waiting === true) {
        return (
          <Waiting participants={participants} name={name} room={room} onClick={gameStart}/>  
        )
    } else if (waiting === false && gameOver === false) {
        return (
            <Room 
            info={info}
            participants={participants}
            myTurn={myTurn}
            onClick={newWord}
            time={time}
            setTime={setTime}
            setNextTurn={setNextTurn}
            round={round}
            setReset={setReset}
            canvas={
                <Canvas
                canvasDisable={myTurn === true ? false : true}
                reset={reset}
                setReset={setReset}
                startDraw={startDrawing}
                endDraw={endDrawing}
                moveDraw={moveDrawing}
                playerX={x}
                playerY={y}
                drawStart={playerStart}
                drawEnd={playerEnd}
                drawMove={playerMove}
                />
            }
            />
        )
    } else if (gameOver === true) {
        return (
            <h1>Scores</h1>
        )
    }
        
}

export default Game