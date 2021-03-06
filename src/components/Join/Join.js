import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import './Join.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../Avatar/Avatar'
import Avatar from '../Avatar/Avatar'
import emojiList from '../Avatar/emojiList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal/Modal'


// Component to render Join page
const Join = ({ location }) => {
    // Error lists
    // States to store data filled in the form
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const errorList = [
        `Username is taken in room ${room}`,
        `Username is too long`,
        `Room name is too long`,
        `Username and/or room name is empty`,
        `Ensure username and/or room name is clean`
    ]
    const [error, setError] = useState('')
    const [defaultRoom, setDefaultRoom] = useState('')
    const [avatar, setAvatar] = useState('0x1F600')

    // Handle getting a random room name
    useEffect(() => {
        // if queries present in url, retrieve them to display
        const { error } = queryString.parse(location.search)
        const { room } = queryString.parse(location.search)
        setDefaultRoom(room)
        setRoom(room)
        if (errorList.find(e => e === error) !== undefined) {
            setError(error)
        }
        // A function to get a random room name
        async function fetchData() {
            const response = await axios.get('https://multiplayer-pictionary.herokuapp.com/room')
            setDefaultRoom(response.data.room)
            setRoom(response.data.room)

        }
        // Only fetch a new room name if the no room name was found in the url
        if (room === '' || room === undefined) { fetchData() }
        return
        // eslint-disable-next-line
    }, [error, location.search])

    // A function to change the avatar
    const pickEmoji = (unicode) => {
        if (emojiList.find(hexCode => hexCode === unicode) === undefined) {
            unicode = ''
        }
        setAvatar(() => unicode)
        return
    }


    return (
        <div className="outerContainer d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="mainHeader row justify-content-center">
                    <div className="col-8 text-center line">
                        <h1 className="appName"><FontAwesomeIcon icon={faPencilAlt} className="mx-auto my-auto" /> Picto</h1>
                    </div>
                </div>
                <div className="header row justify-content-center">
                    <div className="col-12 text-center">
                        <h2>Join or create a room to play pictionary!</h2>
                    </div>
                </div>
                <div className="info row justify-content-center">
                    <div className="col-12 text-center">
                        <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#howToPlay">
                            How to play
                        </button>
                        <Modal />
                    </div>
                </div>
                <div id="form" className="row justify-content-center">
                    <form className="form-signin col-8 line">
                        <div className="error text-center">
                            <p>{error}</p>
                        </div>
                        <div className="form-label-group">
                            <Avatar pickEmoji={pickEmoji} />
                        </div>
                        <div className="form-label-group">
                            <input
                                type="text"
                                name="username"
                                id="id_username"
                                className="form-control"
                                placeholder="Username"
                                title="Type in a name that will be visible to others. Max length is 12 characters :)"
                                maxLength="12"
                                required
                                onChange={(event) => setName(event.target.value.trim().toLowerCase())}
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
                                onChange={(event) => setRoom(event.target.value.trim().toLowerCase())}
                            />
                            <label htmlFor="id_room">Room:</label>
                        </div>
                        <Link
                            className="text-decoration-none"
                            onClick={event => (!name || !room) ? event.preventDefault() : null}
                            to={`/game?name=${name}&room=${room}&avatar=${avatar}`}
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