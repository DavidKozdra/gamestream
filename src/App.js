import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import Ballot from "./Components/Ballot";
import Button from "./Components/Button";
import ChatBox from "./Components/ChatBox";
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

	return (
		<div>
			<div>
				<p> {prompt}</p>
			</div>

			<Ballot votes={ballot} />
			<Button voted={voted} text="1" click={() => ClientVote(1)} />
			<Button voted={voted} text="2" click={() => ClientVote(2)} />
			<Button voted={voted} text="3" click={() => ClientVote(3)} />
			<Button voted={voted} text="4" click={() => ClientVote(4)} />

			<input
				type="range"
				min="0"
				max="70"
				value={time}
				onChange={slider}
			></input>

			<ChatBox Log={MessageLog} />
			<div>
				<input placeholder="message" value={message} onChange={handleInput} />
				<button onClick={() => MessageSend()}>Send</button>
			</div>
		</div>
	);
}

/*	
		<div>
				<input placeholder="message" value="" onChange={} />
				<button id="send" onClick={MessageSend}>
					Send
				</button>
				<ChatBox Log={MessageLog} />
			</div>
            */

export default App;
