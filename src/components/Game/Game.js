import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, Redirect } from 'react-router-dom';
import Waiting from '../Waiting/Waiting'

let socket;

const Game = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [participants, updateParticipants] = useState([])
    const [error, setError] = useState('');
    const [waiting, setWaiting] = useState(true);
    const ENDPOINT = 'localhost:5000';
   
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);
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
    }, [waiting])

    const gameStart = () => {
        setWaiting(false);
        socket.emit('changeWaiting', room);
    }
    
    
    if (error !== "" && error !== undefined) {
        return (
            <Redirect to={`/join?error=${error}`} />
        )
    } else if (waiting == true) {
        return (
          <Waiting participants={participants} name={name} room={room} onClick={gameStart}/>  
        )
    } else if (waiting == false) {
        return (
            <h1>Game</h1>
        )
    }
        
}

export default Game