import React, { useState, useEffect } from "react";
import queryString from "query-string";
import "./Join.css";
import axios from "axios";
import "../Avatar/Avatar";
import emojiList from "../Avatar/emojiList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import HelpModal from "../HelpModal/HelpModal";
import Form from "../Form/Form";

const standardErrors = [
	"Username is too long",
	"Room name is too long",
	"Username and/or room name is empty",
	"Ensure username and/or room name is clean",
];

// Component to render Join page
const Join = ({ location }) => {
	// States to store data filled in the form
	const obj = queryString.parse(location.search);
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [errorList, setErrorList] = useState([
		`Username is taken in room ${room}`,
		...standardErrors,
	]);
	const [error, setError] = useState(obj.error);
	const [avatar, setAvatar] = useState("");
	const [index, setIndex] = useState(Math.floor(Math.random() * emojiList.length));

	// Handle getting a random room name
	useEffect(() => {
		// if queries present in url, retrieve them to display
		const { error, room } = queryString.parse(location.search);
		if (room !== undefined) {
			setRoom(room);
		}
		const newErrorList = [`Username is taken in room ${room}`, ...standardErrors];
		setErrorList(newErrorList);
		if (errorList.find((e) => e === error) !== undefined) {
			setError(error);
		}
		// A function to get a random room name
		async function fetchData() {
			const response = (await axios.get(import.meta.env.VITE_APP_SERVER + "/room")).data;
			setRoom(response.room);
			const newErrorList = [`Username is taken in room ${response.room}`, ...standardErrors];
			setErrorList(newErrorList);
		}
		// Only fetch a new room name if the no room name was found in the url
		if (room === "" || room === undefined) {
			fetchData();
		}
		return;
		// eslint-disable-next-line
	}, [location.search]);

	// A function to change the avatar
	const pickEmoji = (unicode) => {
		if (emojiList.find((hexCode) => hexCode === unicode) === undefined) {
			unicode = "";
		}
		setAvatar(() => unicode);
		return;
	};
	// Set the avatar to the unicode selected using pickEmoji function
	useEffect(() => {
		pickEmoji(emojiList[index]);
	}, [index]);

	useEffect(() => {
		if (name && room && error === "Username and/or room name is empty") {
			setError("");
		}
	}, [room, name, error]);

	// Handle form submit
	const handleFormSubmit = (event) => {
		if (!name || !room) {
			event.preventDefault();
			setError(`Username and/or room name is empty`);
		} else {
			return null;
		}
	};

	return (
		<div className="outerContainer d-flex align-items-center min-vh-100">
			<div className="container">
				<div className="mainHeader row justify-content-center">
					<div className="col-8 text-center line">
						<h1 className="appName">
							<FontAwesomeIcon icon={faPencilAlt} className="mx-auto my-auto" /> Picto
						</h1>
					</div>
				</div>
				<div className="header row justify-content-center">
					<div className="col-12 text-center">
						<h2>Join or create a room to play pictionary!</h2>
					</div>
				</div>
				<div className="info row justify-content-center">
					<div className="col-12 text-center">
						<button
							type="button"
							className="btn btn-primary btn-sm"
							data-toggle="modal"
							data-target="#howToPlay"
						>
							How to play
						</button>
						<HelpModal />
					</div>
				</div>
				<div id="form" className="row justify-content-center">
					<Form
						error={error}
						index={index}
						setIndex={setIndex}
						setName={setName}
						setRoom={setRoom}
						disabled={false}
						handleFormSubmit={handleFormSubmit}
						buttonText={"Join"}
						avatar={avatar}
						name={name}
						room={room}
						update={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default Join;
