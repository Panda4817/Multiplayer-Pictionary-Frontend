import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import axios from 'axios'

describe("Rendering <App />", () => {
	it("It should render join, modal and footer components", () => {
		axios.get.mockResolvedValue({
			data: {room: "test"}
		})
		const { getByText, getByPlaceholderText } = render(<App />);
		expect(getByText("Join or create a room to play pictionary!")).toBeInTheDocument();
		expect(getByText("Picto")).toBeInTheDocument();
		expect(getByPlaceholderText("Username")).toBeInTheDocument();
		expect(getByPlaceholderText("Room")).toBeInTheDocument();
		expect(getByText("How to play")).toBeInTheDocument();
		expect(getByText("Next")).toBeInTheDocument();
		expect(getByText("Previous")).toBeInTheDocument();
		expect(getByText(/Created by KMunton/)).toBeInTheDocument();
	});
});
