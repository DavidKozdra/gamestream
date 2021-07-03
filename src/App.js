import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import Ballot from "./Components/Ballot";
import ChatBox from "./Components/ChatBox";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const socket = socketIOClient("ws://localhost:8080");
const username = "s";

socket.on("connection", () => {
	/* idk */
});

function DisplayOptions(options) {
	var out = "";
	for (var i = 0; i < options.length; i++) {
		out += "\n " + (i + 1) + ". " + options[i].title;
	}

	return out;
}

function slider() {}

function App() {
	const [voted, setvoted] = useState("");
	const [prompt, setprompt] = useState("");
	const [ballot, setballot] = useState("");
	const [time, settime] = useState("");
	const [message, setMessage] = useState("");
	const [MessageLog, setMessagelog] = useState("");

	const [options, setoptions] = useState("");

	/*
    this can stay mostly the same but should go into the commponet
    as the onclick of button
    then set the boolean
    keep emit?
    may have some data issues 
    */
	function ClientVote(vote) {
		// too many re-renders
		setvoted(true);
		socket.emit("vote", vote);
	}

	/*
    creating elements in react???
    make component Chat-Box
    chat box prop text
    
    */
	socket.on("message", (text) => {
		console.log("Message Sent " + text);
		setMessagelog(MessageLog.concat("^" + username + ": " + text));
	});

	/*
    not fully sure how to do this 

    state bool on/off
    maybe look up : react disable buttons 
    component prompt
    set prompt to prop.prompt
    
    */
	socket.on("prompt", (prompt, options, winner) => {
		// use react to do this winner != null ?? alert("You all picked option " + winner);
		settime(0);
		setvoted(false);
		setoptions(options);
		setprompt(prompt.title + " " + prompt.text + DisplayOptions(options));
	});

	/*
    this is easy 

    make a component ballot that takes prop votes 
    socket.on in app 
    props.votes[0] + so on
    */

	socket.on("updateVotes", (votes) => {
		setballot(votes);
	});

	function MessageSend() {
		console.log("tick");
		socket.emit("message", message);
		console.log(MessageLog);
		setMessage("");
	}

	socket.on("tick", (time) => {
		settime(time);
	});
	const handleInput = (event) => {
		socket.emit("typing");
		setMessage(event.target.value);
	};

	function afterSubmission(event) {
		event.preventDefault();
		MessageSend();
	}

	return (
		<div>
			<Box>
				<input
					className="slider-square"
					type="range"
					min="0"
					max="70"
					value={time}
					onChange={slider}
				></input>

				<div>
					<p> {prompt}</p>
				</div>

				<Ballot votes={ballot} />

				<div>
					<ButtonGroup
						orientation="vertical"
						color="primary"
						aria-label="vertical contained primary button group"
						variant="contained"
					>
						<Button disabled={voted} onClick={() => ClientVote(1)}>
							{"1. " + options[0].title}
						</Button>
						<Button disabled={voted} onClick={() => ClientVote(2)}>
							{"2. " + options[1].title}
						</Button>
						<Button disabled={voted} onClick={() => ClientVote(3)}>
							{"3. " + options[2].title}
						</Button>
						<Button disabled={voted} onClick={() => ClientVote(4)}>
							{"4. " + options[3].title}
						</Button>
					</ButtonGroup>
				</div>

				<ChatBox Log={MessageLog} />
				<div>
					<form
						noValidate
						autoComplete="off"
						placeholder="message"
						onSubmit={afterSubmission}
					>
						<TextField
							id="standard-basic"
							label={username}
							value={message}
							onChange={handleInput}
						/>
					</form>
					<Button onClick={() => MessageSend()}>Send</Button>
				</div>
			</Box>
		</div>
	);
}

export default App;
