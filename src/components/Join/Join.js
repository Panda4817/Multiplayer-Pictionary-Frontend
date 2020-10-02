import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './Join.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Join = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [error, setError] = useState('')
    const [defaultRoom, setDefaultRoom] = useState('')

    useEffect(() => {
        const { error } = queryString.parse(location.search);
        const { room } = queryString.parse(location.search)
        setError(error)
        setDefaultRoom(room)
        setRoom(room)
        console.log(room)
        async function fetchData() {
            const response = await axios.get('/room');
                setDefaultRoom(response.data.room);
                setRoom(response.data.room);
            
        }
        if (room === '' || room === undefined) {fetchData()};
        return;
    }, [error, location.search])

    


    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
        <div className="container">
            <div className="mainHeader row justify-content-center">
                <div className="col-8 text-center line">
                    <h1>Pictionary</h1>
                </div>
            </div>
            <div className="header row justify-content-center">
                <div className="col-12 text-center">
                    <h2>Join or Create a Game</h2>
                </div>
            </div>
            <div className="info row justify-content-center">
                <div className="col-12 text-center">
                    <p>Type in a temporary username and a room name. The room name could be an existing room or a new room</p>
                </div>
            </div>
            <div id="form" className="row justify-content-center">
                <form className="form-signin col-8 line">
                    <div className="error text-center">
                        <p>{error}</p>
                    </div>
                    <div className="form-label-group">
                        <input 
                            type="text" 
                            name="username" 
                            id="id_username" 
                            className="form-control" 
                            placeholder="Username"
                            title="Type in a name that will be visible to others. Max length is 150 characters :)" 
                            maxLength="150"
                            required
                            onChange={(event) => setName(event.target.value)} 
                        />
                        <label htmlFor="id_username">Username:</label>
                    </div>
                    <div className="form-label-group">
                        <input 
                            type="text" 
                            name="room" 
                            id="id_room" 
                            className="form-control" 
                            placeholder="Room"
                            defaultValue={defaultRoom}
                            title="Type in a room name. Could be one that is already created and you are joining or a brand new room. Max length is 150 characters"
                            maxLength="150"
                            required
                            onChange={(event) => setRoom(event.target.value)} 
                        />
                        <label htmlFor="id_room">Room:</label>
                    </div>
                    <Link 
                        className="text-decoration-none"
                        onClick={event => (!name || !room) ? event.preventDefault() : null} 
                        to={`/game?name=${name}&room=${room}`}
                    >
                        <button className="btn btn-primary btn-lg btn-block" type="submit">Join</button>
                    </Link>
                    
                </form>

            </div>
        </div>
        </div>
    )
}

export default Join