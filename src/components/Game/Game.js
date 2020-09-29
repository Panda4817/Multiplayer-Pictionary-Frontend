import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, Redirect } from 'react-router-dom';
import Waiting from '../Waiting/Waiting'
import Canvas from '../Canvas/Canvas'

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
            <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-12">
                        <h1>Info about who's drawing /  what word</h1>
                    </div>
                </div>
                <div className="mainHeader row justify-content-center">
                    <div className="col-lg-6">
                        <p>Canvas Controls</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div id="canvas" className="col-lg-6">
                        <Canvas  />
                    </div>
                    <div className="header col-lg-3">
                        <h2>Participants</h2>
                    </div>
                    <div className="header col-lg-3">
                        <h2>Chat</h2>
                    </div>

                </div>
            </div>
            </div>
        )
    }
        
}

export default Game