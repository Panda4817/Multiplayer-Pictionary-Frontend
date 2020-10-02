import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, Redirect } from 'react-router-dom';
import Waiting from '../Waiting/Waiting'
import Room from '../Room/Room'

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
            setRound(() => n)
            checkRound();    
        })
    }, [round])

    useEffect(() => {
        if (nextTurn == true) {
            turnLogic();    
        }
        socket.on('turn', ({ chosen, word }) => {
            console.log(name, chosen.name)
            if (name == chosen.name) {  
                setInfo(() => 'Word is ' + word);
                setMyTurn(true);
                setTime(true);
            } else {
                setInfo(() => chosen.name + ' is drawing...')
                setMyTurn(false)
                setTime(true);
            }
              
        })
        setNextTurn(false);
       
    }, [nextTurn, info])

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
        })
        socket.on('moveDrawing', ({ x, y}) => {
            setPlayerStart(false)
            setPlayerEnd(false)
            setPlayerMove(true)
        })
        socket.on('endDrawing', () => {
            setPlayerStart(false)
            setPlayerEnd(true)
            setPlayerMove(false) 
        })
    }, [playerStart, playerMove, playerEnd])

    const gameStart = () => {
        console.log("game started")
        setWaiting(false);
        socket.emit('changeWaiting', room);
        setNextTurn(true)
    }

    const checkRound = () => {
        if (round > 5) {
            setGameOver(true);
        }
    }

    const turnLogic = () => {
        console.log("turn logic started")
        checkRound()
        socket.emit('whoseTurn', {round, room});
    };

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
    } else if (waiting == true) {
        return (
          <Waiting participants={participants} name={name} room={room} onClick={gameStart}/>  
        )
    } else if (waiting == false) {
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
            startDrawing={startDrawing}
            endDrawing={endDrawing}
            moveDrawing={moveDrawing}
            playerStart={playerStart}
            playerEnd={playerEnd}
            playerMove={playerMove}
            />
        )
    } else if (gameOver == true) {
        return (
            <h1>Scores</h1>
        )
    }
        
}

export default Game