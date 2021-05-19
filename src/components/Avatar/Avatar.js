import React, { useEffect, useState } from "react";
import emojiList from "./emojiList";

const Avatar = ({ pickEmoji }) => {
	// Choose a random emoji to display
	const [randomIndex, setRandomIndex] = useState(
		Math.floor(Math.random() * emojiList.length)
	);
	// Set the avatar to that random emoji initially
	useEffect(() => {
		pickEmoji(emojiList[randomIndex]);
	}, [randomIndex, pickEmoji]);

	// Function to get the active emoji and set the avatar
	// Added a time out to allow the carousal to refresh and add active attribute
	const getKey = () => {
		setTimeout(() => {
			let current = document.querySelector(
				"div[class='carousel-item active']"
			);
			let idParts = current.getAttribute("id").split("_");
			setRandomIndex(idParts[1]);
		}, 10);
	};

	// Return bootstrap carousel
	return (
		<div
			id="emojiCarousel"
			className="carousel"
			data-ride="carousel"
			data-interval="0"
		>
			<div className="carousel-inner">
				{
					// Loop through emoji list to return one emoji per carousel slide
					emojiList.map((val, i) => {
						return (
							<div
								id={"id_" + i}
								key={val}
								className={
									i === randomIndex
										? "carousel-item active"
										: "carousel-item"
								}
							>
								<h1 className="mx-auto text-center">
									{String.fromCodePoint(val)}
								</h1>
							</div>
						);
					})
				}
			</div>
			<a
				className="carousel-control-prev"
				href="#emojiCarousel"
				role="button"
				data-slide="prev"
				onClick={getKey}
			>
				<span
					className="carousel-control-prev-icon"
					aria-hidden="true"
				></span>
				<span className="sr-only">Previous</span>
			</a>
			<a
				className="carousel-control-next"
				href="#emojiCarousel"
				role="button"
				data-slide="next"
				onClick={getKey}
			>
				<span
					className="carousel-control-next-icon"
					aria-hidden="true"
				></span>
				<span className="sr-only">Next</span>
			</a>
		</div>
	);
};

export default Avatar;
