import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import Waiting from '../Waiting/Waiting'
import Room from '../Room/Room'
import Canvas from '../Canvas/Canvas'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

let socket;

const Game = ({ location }) => {
    // Room variables
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [participants, updateParticipants] = useState([])
    const [error, setError] = useState('');
    const [waiting, setWaiting] = useState(true);
    
    // Game variables
    const [round, setRound] = useState(1);
    const [info, setInfo] = useState('');
    const [myTurn, setMyTurn] = useState(false);
    const [chosen, setChosen] = useState('');
    const [word, setWord] = useState('');
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');
    const [word3, setWord3] = useState('');
    const [choosing, setChoosing] = useState(false);
    const [resetTime, setResetTime] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [spinner, setSpinner] = useState(false);

    // Chat variables
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Drawing variables
    const [data, setData] = useState(null);
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

            socket.emit('disconnect');
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
        socket.on('waitingTrue', () => {
            setWaiting(true);
        })
    }, [waiting])

    useEffect(() => {
        socket.on('turn', ({ chosen, round }) => {
            setRound(() => round);
            setChosen(() => chosen);
            setChoosing(false);
            setWord(() => '')
            setMyTurn(false);
        })
        socket.on('myturn', ({ chosen, word, round }) => {
            setRound(() => round);
            setChosen(() => chosen);
            setChoosing(false);
            setWord(() => word)
            setMyTurn(true);
        })  
    }, [word])

    useEffect(() => {
        socket.on('choosing', ({ chosen, round }) => {
            setRound(() => round);
            setChosen(() => chosen);
            setChoosing(true)
            setMyTurn(false);     
        })
        socket.on('choice', ({ chosen, word1, word2, word3, round }) => {
            setRound(() => round);
            setChosen(() => chosen);
            setMyTurn(true);
            setChoosing(true)
            setWord1(word1);
            setWord2(word2);
            setWord3(word3);
        })
    }, [chosen])

    useEffect(() => {
        if (waiting === true) {
            return;
        }
        if (myTurn === true) {
            if (choosing === true) {
                setInfo(() => 'Choose a word')
            } else {
            setInfo(() => 'Word is ' + word) 
            }
            
        } else if (chosen !== '') {
            if (choosing === true){
                setInfo(() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + ' is choosing a word')
            } else {
            setInfo(() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + ' is drawing...') 
            }
            
        }  
        
    }, [choosing, word, myTurn, chosen, waiting])

    useEffect(() => {
        socket.on('gameOver', () => {
            setGameOver(true)
        });
    }, [gameOver])

    useEffect(() => {
        socket.on('resetTime', () => {
            setResetTime(true)
        })
    }, [resetTime])

    useEffect(() => {
        socket.on('draw_line', function (data) {
            setData(() => data);
        });
    }, [data])

    useEffect(()=> {
        socket.on('spinner', () => {
            setSpinner(true);
        })
    }, [spinner])

    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
    }, []);

    const gameStart = () => {
        console.log("game started")
        setWaiting(false);
        socket.emit('changeWaiting', room);
        socket.emit('gameStart', { room, round });
        

    }

    const newWord = (word) => {
        socket.emit('chosenWord', { word, room, chosen, round});
    }

    const emitDrawing = (data) => {
        socket.emit('emitDrawing', {data, room})
        console.log(data)
    }

    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
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
            name={name} 
            info={info}
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
            canvas={
                <Canvas
                canvasDisable={myTurn === true ? false : true}
                reset={reset}
                setReset={setReset}
                emitDrawing={emitDrawing}
                data={data}
                waiting={waiting}
                />
            }
            messagesList={
                <Messages messages={messages} name={name} />
            }
            input={
                <Input
                message={message} 
                setMessage={setMessage} 
                sendMessage={sendMessage}
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