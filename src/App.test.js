import React from "react";
import { render, cleanup } from "@testing-library/react";
import App from "./App";

describe("Rendering <App />", () => {
	afterEach(cleanup);
	it("It should render join, modal and footer components", () => {
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
