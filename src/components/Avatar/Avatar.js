import React from "react";
import emojiList from "./emojiList";

const Avatar = ({ index, setIndex }) => {
	// Return bootstrap carousel
	return (
		<div id="emojiCarousel" className="carousel" data-ride="carousel" data-interval="0">
			<div className="carousel-inner">
				{
					// Loop through emoji list to return one emoji per carousel slide
					emojiList.map((val, i) => {
						return (
							<div
								id={"id_" + i}
								key={val}
								className={i === index ? "carousel-item active" : "carousel-item"}
							>
								<h1 className="mx-auto text-center">{String.fromCodePoint(val)}</h1>
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
				onClick={setIndex}
			>
				<span className="carousel-control-prev-icon" aria-hidden="true"></span>
				<span className="sr-only">Previous</span>
			</a>
			<a
				className="carousel-control-next"
				href="#emojiCarousel"
				role="button"
				data-slide="next"
				onClick={setIndex}
			>
				<span className="carousel-control-next-icon" aria-hidden="true"></span>
				<span className="sr-only">Next</span>
			</a>
		</div>
	);
};

export default Avatar;
