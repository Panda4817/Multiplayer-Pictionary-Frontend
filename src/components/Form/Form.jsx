import React from "react";
import "./Form.css";
import { Link } from "react-router-dom";
import "../Avatar/Avatar";
import Avatar from "../Avatar/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import emojiList from "../Avatar/emojiList";

function Form(props) {
	// Remove active from carousel and randomise the index
	const handleSetIndex = () => {
		let current = document.querySelector("div[class='carousel-item active']");
		if (current) {
			current.classList.remove("active");
		}
		props.setIndex(Math.floor(Math.random() * emojiList.length));
	};
	// Function to get the active emoji and set the avatar
	// Added a time out to allow the carousal to refresh and add active attribute
	const getKey = () => {
		setTimeout(() => {
			let current = document.querySelector("div[class='carousel-item active']");
			if (current) {
				let idParts = current.getAttribute("id").split("_");
				props.setIndex(idParts[1]);
			} else {
				props.setIndex(Math.floor(Math.random() * emojiList.length));
			}
		}, 10);
	};

	return (
		<form className="form-signin col-8 line">
			<div className="error text-center">
				<p>{props.error}</p>
			</div>
			<div className="form-label-group row">
				<div className="col-6">
					<Avatar index={props.index} setIndex={getKey} />
				</div>
				<div className="col-6">
					<button
						className="btn btn-primary btn-lg btn-block  text-center"
						type="button"
						onClick={handleSetIndex}
					>
						<FontAwesomeIcon icon={faRandom} />
					</button>
				</div>
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
					value={props.name}
					required
					onChange={(event) => {
						props.setName(event.target.value.trim().toLowerCase());
						if (props.name && props.setError) {
							props.setError("");
						}
					}}
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
					value={props.room}
					title="Type in a room name. Could be one that is already created and you are joining or a brand new room. Max length is 150 characters"
					maxLength="150"
					required
					disabled={props.disabled}
					onChange={(event) => {
						props.setRoom(event.target.value.trim().toLowerCase());
					}}
				/>
				<label htmlFor="id_room">Room:</label>
			</div>
			<Link
				className="text-decoration-none"
				onClick={(event) => props.handleFormSubmit(event)}
				to={`/game?name=${props.name}&room=${props.room}&avatar=${props.avatar}&update=${props.update}`}
			>
				<button className="btn btn-primary btn-lg btn-block" type="submit">
					{props.buttonText}
				</button>
			</Link>
		</form>
	);
}

export default Form;
