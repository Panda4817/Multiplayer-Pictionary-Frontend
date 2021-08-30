import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import Waiting from "../Waiting/Waiting";
import Room from "../Room/Room";
import Canvas from "../Canvas/Canvas";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import PostGame from "../PostGame/PostGame";
import Controls from "../Controls/Controls";
import emojiList from "../Avatar/emojiList";
import Form from "../Form/Form";

let socket;
// Waiting room errors that should nor redirect you to the join room
const errors = [
	"Username is empty",
	"Username is too long (max 12 characters)",
	"Room name cannot be updated in the waiting room (Close the window and join a new room)",
	"Username cannot be empty",
	"Username cannot be too long (max 12 characters)",
];

const Game = ({ location }) => {
	// Room variables
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [avatar, setAvatar] = useState("");
	const [index, setIndex] = useState(-1);
	const [participants, updateParticipants] = useState([]);
	const [error, setError] = useState("");
	const [waiting, setWaiting] = useState(true);

	// Game variables
	const [round, setRound] = useState(1);
	const [info, setInfo] = useState("");
	const [myTurn, setMyTurn] = useState(false);
	const [chosen, setChosen] = useState("");
	const [word, setWord] = useState("");
	const [word1, setWord1] = useState("");
	const [word2, setWord2] = useState("");
	const [word3, setWord3] = useState("");
	const [choosing, setChoosing] = useState(false);
	const [resetTime, setResetTime] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [spinner, setSpinner] = useState(false);
	const [guessCorrect, setGuessCorrect] = useState(false);

	// Chat variables
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	// Drawing variables
	const [data, setData] = useState(null);
	const [reset, setReset] = useState(false);
	const [colour, setColour] = useState("#000000");
	const [lineWidth, setLineWidth] = useState(5);
	const [undo, setUndo] = useState(false);

	// URL of back end
	// Hosted on heroku
	// const ENDPOINT =
	//	"https://multiplayer-pictionary.herokuapp.com";
	// Localhost URL used for testing
	const ENDPOINT = process.env.REACT_APP_SERVER;

	const parseLocationData = () => {
		let { name, room, avatar, update } = queryString.parse(location.search);
		if (name !== undefined && name !== "") {
			setName(name.trim().toLowerCase());
		} else {
			setName("");
			name = "";
		}
		if (room !== undefined && room !== "") {
			setRoom(room.trim().toLowerCase());
		} else {
			setRoom("");
			room = "";
		}
		let found;
		let foundIndex;
		emojiList.map((hexCode, i) => {
			if (hexCode === avatar) {
				found = hexCode;
				foundIndex = i;
			}
			return null;
		});
		if (found !== undefined) {
			setAvatar(avatar);
			setIndex(foundIndex);
		} else {
			setAvatar("");
			setIndex(-1);
			avatar = "";
		}
		update = update === "true";
		return { name, room, avatar, update };
	};

	// Handles refresh of page, joining and disconnecting of players to game room
	useEffect(() => {
		let { name, room, avatar, update } = parseLocationData();
		socket = io(ENDPOINT);
		socket.emit("join", { name, room, avatar, update }, (error) => {
			if (error !== null) {
				setError(error);
			}
		});
		if (errors.indexOf(error) < 0) {
			document.getElementById("closeModal").click();
		}
		return () => {
			//socket.emit('disconnect') v2 socket-io
			socket.close();
			socket.off();
		};
		// eslint-disable-next-line
	}, [ENDPOINT, location.search]);

	// handle changing avatar
	useEffect(() => {
		if (emojiList.find((unicode) => emojiList[index] === unicode) !== undefined) {
			setAvatar(() => emojiList[index]);
		}
	}, [index]);

	// Handles updating player lists, including scores
	useEffect(() => {
		socket.on("updateUsers", (users) => {
			updateParticipants(() => users);
		});
	}, [participants, location.search]);

	// Handle closing modal on waiting room
	useEffect(() => {
		socket.on("closeModal", () => {
			document.getElementById("closeModal").click();
		});
	}, [location.search]);

	// Handles changing from waiting room to game room and vice versa
	useEffect(() => {
		socket.on("waitingFalse", () => {
			setWaiting(false);
		});
		socket.on("waitingTrue", () => {
			setWaiting(true);
		});
	}, [waiting, location.search]);

	// Handles turn logic when new word received
	useEffect(() => {
		socket.on("turn", ({ chosen, round }) => {
			setRound(() => round);
			setChosen(() => chosen);
			setChoosing(false);
			setWord(() => "");
			setMyTurn(false);
		});
		socket.on("myturn", ({ chosen, word, round }) => {
			setRound(() => round);
			setChosen(() => chosen);
			setChoosing(false);
			setWord(() => word);
			setMyTurn(true);
		});
	}, [word, location.search]);

	// Handles choice of words logic when new person is chosen to draw
	useEffect(() => {
		socket.on("choosing", ({ chosen, round }) => {
			setRound(() => round);
			setChosen(() => chosen);
			setChoosing(true);
			setMyTurn(false);
			setGuessCorrect(false);
			setMessage(() => "");
		});
		socket.on("choice", ({ chosen, word1, word2, word3, round }) => {
			window.scrollTo(0, 0);
			setRound(() => round);
			setChosen(() => chosen);
			setMyTurn(true);
			setChoosing(true);
			setWord1(word1);
			setWord2(word2);
			setWord3(word3);
			setGuessCorrect(false);
			setMessage(() => "");
		});
	}, [chosen, location.search]);

	// Handles the info string that is shown to each player in the game room
	useEffect(() => {
		if (waiting === true) {
			return;
		}
		if (myTurn === true) {
			if (choosing === true) {
				setInfo(() => "Choose a word");
			} else {
				setInfo(() => "Word is " + word);
			}
		} else if (chosen !== "") {
			if (choosing === true) {
				setInfo(
					() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + " is choosing a word"
				);
			} else {
				setInfo(() => chosen["name"][0].toUpperCase() + chosen["name"].slice(1) + " is drawing...");
			}
		}
	}, [choosing, word, myTurn, chosen, waiting]);

	// Handles game over logic
	useEffect(() => {
		socket.on("gameOver", () => {
			setGameOver(true);
		});
	}, [gameOver, location.search]);

	// Handles resetting the timer after each turn
	useEffect(() => {
		socket.on("resetTime", () => {
			setResetTime(true);
		});
	}, [location.search]);

	// Handles receiving drawing data
	useEffect(() => {
		socket.on("draw_line", function (data) {
			setData(() => data);
		});
	}, [data, location.search]);

	// Handles when spinner is shown in the game room
	useEffect(() => {
		socket.on("spinner", () => {
			setSpinner(true);
		});
	});

	// Handles receiving messages in the chat
	useEffect(() => {
		socket.on("message", (message) => {
			setMessages((messages) => [...messages, message]);
		});
	}, [location.search]);

	// Set guess correct true for a correct guess (used to change border colour and confetti effect)
	useEffect(() => {
		let len = messages.length;
		if (len === 0) {
			return;
		}
		if (messages[len - 1].text.includes("correct")) {
			setGuessCorrect(() => (messages[len - 1]["user"] === name ? true : false));
		} else {
			setGuessCorrect(() => false);
		}
	}, [messages, name]);

	// Added confetti effect for correct guess
	useEffect(() => {
		if (guessCorrect === true) {
			window.confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	}, [guessCorrect]);

	// Handles canvas resetting
	useEffect(() => {
		socket.on("reset", () => {
			setGameOver(false);
			setSpinner(false);
			setColour("#000000");
			setLineWidth(5);
		});
	});

	// Handles clearing the canvas
	useEffect(() => {
		socket.on("clear", () => {
			setReset(true);
		});
	}, [location.search]);

	// Handles undo button for the canvas
	useEffect(() => {
		socket.on("undo", () => {
			setUndo(true);
		});
	}, [location.search]);

	// Function to start the game and move to the game room
	const gameStart = () => {
		setGameOver(false);
		setSpinner(false);
		setWaiting(false);
		setColour("#000000");
		setLineWidth(5);
		socket.emit("changeWaiting", room);
		socket.emit("gameStart", room);
		window.scrollTo(0, 0);
	};

	// Function to emit chosen word from choice list
	const newWord = (word) => {
		socket.emit("chosenWord", { word, room });
	};

	// Function to emit drawing data by the player that is drawing
	const emitDrawing = (data) => {
		socket.emit("emitDrawing", { data, room });
	};

	// Function to emit messages sent
	const sendMessage = (event) => {
		event.preventDefault();

		// Lose focus
		if (message) {
			event.target.blur();
			socket.emit("sendMessage", message, () => {
				setMessage("");
			});
		}
	};

	// Function to change colour of brush
	const changeColour = (colour) => {
		setColour(colour);
	};

	// Function to handle change of line width
	const changeWidth = (num) => {
		setLineWidth(num);
	};

	// Function to handle clearing the canvas by emitting the event
	const clearCanvas = () => {
		setReset(true);
		socket.emit("clear", room);
	};

	// Function to undo lines on the canvas by emitting the event
	const undoCanvas = () => {
		setUndo(true);
		socket.emit("undo", room);
	};

	// Function to handle when update button pressed for updating player details
	const updatePlayer = (event) => {
		if (!name) {
			event.preventDefault();
			setError(`Username cannot be empty`);
			parseLocationData();
		} else if (name.length > 12) {
			event.preventDefault();
			setError(`Username cannot be too long (max 12 characters)`);
			parseLocationData();
		} else if (name && room && avatar) {
			setError("");
			document.getElementById("closeModal").click();
		}
		return null;
	};

	// Handle what to show on the page depending on where the player is- waiting room, game, post-game
	if (error !== "" && error !== undefined && errors.indexOf(error) < 0) {
		window.scrollTo(0, 0);
		return <Redirect to={`/join?room=${room}&error=${error}`} />;
	} else if (waiting === true) {
		window.scrollTo(0, 0);
		return (
			<Waiting
				participants={participants}
				name={name}
				room={room}
				avatar={avatar}
				setError={setError}
				resetPlayer={parseLocationData}
				setName={setName}
				onClick={gameStart}
				form={
					<Form
						error={error}
						setError={setError}
						index={index}
						setIndex={setIndex}
						setName={setName}
						setRoom={() => {}}
						disabled={true}
						handleFormSubmit={updatePlayer}
						buttonText={"Update"}
						avatar={avatar}
						name={name}
						room={room}
						update={true}
					/>
				}
			/>
		);
	} else if (waiting === false && gameOver === false) {
		return (
			<Room
				name={name} //pass username to game room
				info={info} //pass info string to game room to display
				avatar={avatar} //pass avatar unicode to game room to display
				participants={participants} //pass player list to extract information and display
				myTurn={myTurn} //pass if the player is the drawing person
				onClick={newWord} //pass the function to use when player clicks ona word to choose it
				word1={word1} //pass the 3 choice words
				word2={word2}
				word3={word3}
				choosing={choosing} //pass whether player is choosing a word or not (determines if timer should be running)
				resetTime={resetTime} //pass whether timer should reset
				setResetTime={setResetTime} //pass function, that resets timer so resetTime is not always true
				round={round} //pass the round number to game room to display
				setReset={setReset} //pass the setReset variable so canvas can reset at the same time the turn ends
				spinner={spinner} //pass the spinner variable that determines if the spinner should be shown
				setSpinner={setSpinner}
				guessCorrect={guessCorrect} // Change canvas border colour to visually tell you if the guess was right
				controls={
					<Controls
						changeColour={changeColour} //pass the function that handles changing of colour
						clearCanvas={clearCanvas} //pass the function that handles clearing canvas
						changeWidth={changeWidth} //pass the function that changes the width of the line
						controlsDisable={myTurn === true ? false : true} //pass the variable that determines if the controls are disabled
						lineWidth={lineWidth} //pass the current line width to the controls, so value of the control can be set
						undoCanvas={undoCanvas} //pass the function that handles undoing lines drawn
					/>
				}
				canvas={
					<Canvas
						canvasDisable={myTurn === true ? false : true} //pass the variable that determines if the canvas is disabled
						reset={reset} //pass the variable that determines if the canvas should be reset
						setReset={setReset} //pass the function that resets the variable to false
						emitDrawing={emitDrawing} //pass the function the emits drawing data using web sockets
						data={data} //pass current drawing data received over web sockets
						waiting={waiting} //pass the waiting variable, so if everyone gets kicked out, canvas can be reset
						colour={colour} //pass current brush colour
						lineWidth={lineWidth} //pass current brush line width
						undo={undo} //pass undo variable to determine if lines should be erased
						setUndo={setUndo} //pass the functions that resets that variable to false (so you don't keep erasing lines)
					/>
				}
				messagesList={<Messages messages={messages} name={name} avatar={avatar} />}
				input={
					<Input
						message={message} //pass the current message to display in the input (used to set input value)
						setMessage={setMessage} //pass the function to set the message state
						sendMessage={sendMessage} //pass the function to emit the message sent
						disable={myTurn} //pass the variable to disable the input field if drawing
					/>
				}
			/>
		);
	} else if (gameOver === true) {
		window.scrollTo(0, 0);
		return (
			<PostGame
				participants={participants} //pass player data to display
				onClick={gameStart} //pass function to start the game again if clicked
				name={name}
			/>
		);
	}
};

export default Game;
