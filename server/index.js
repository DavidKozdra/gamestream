const { setupMaster } = require("cluster");
const { lstat } = require("fs");
const { maxHeaderSize } = require("http");

const http = require("http").createServer();
const io = require("socket.io")(http, {
	cors: { orgin: "*" },
});

const PromptTree = {
	0: {
		title: "Welcome to GameStream",
		text: "Your team sees a sword",
		options: [
			{ title: "Pick it up", link: 2 },
			{ title: "Run", link: 6 },
			{ title: "ignore it", link: 10 },
			{ title: "Inspect it" },
		],
	},
	2: {
		title: "",
		text: "All of you hold it at once but whos is it",
		options: [{ title: "Give it to the strongest" }, { title: "Sell it" }],
	},
	6: {
		title: "",
		text: "You walk away only to be attacked by a bear",
		options: [{ title: "New option" }, { title: "Cower" }],
	},
	10: {
		title: "",
		text: "You walk away only to be attacked by a bear",
		options: [
			{ title: "New option", link: 10 },
			{ title: "Cower", link: 10 },
		],
	},
};

var votes = [0, 0, 0, 0];

function ClearVotes() {
	for (var i = 0; i < votes.length; i++) {
		votes[i] = 0;
	}
	io.emit("updateVotes", votes);
}

function ManageVote(vote) {
	votes[vote - 1] += 1;
	io.emit("updateVotes", votes);
	console.log("Client voted "); // this is happening all the time
}

function sum(arr) {
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	//console.log("sum of votes " + sum);
	return sum;
}

function HighestVote(arr) {
	var m = 0;
	var vote = 0;
	var winners = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > m) {
			m = arr[i];
			vote = i;
		}
	}

	/*
    in case of tie we

    for(each in arr){
        if arr[i ] == m
            winners.append(i);
    }

    foreach in winner pick random from 0 to length

    or 
    have special event emit that makes users choose between the two
    */

	return vote;
}
var index = 0;
function CheckWinner() {
	if (sum(votes) > 0) {
		var winner = HighestVote(votes);
		if (PromptTree[index].options != null) {
			index = PromptTree[index].options[winner].link;
			console.log("winner  " + winner);
			ClearVotes();
			time = 0;
			io.emit("prompt", PromptTree[index], PromptTree[index].options);
		} else {
			io.emit("prompt", "The End", ["thanks for playing", " ", "", ""]);
		}
	}
}

var time = 0;
function tick() {
	if (sum(votes) > 0) {
		if (time != 70) {
			io.emit("tick", (time += 1));
		} else {
			CheckWinner();
		}
	}
}

io.on("connection", (socket) => {
	console.log("connected");

	io.emit("updateVotes", votes);

	io.emit("prompt", PromptTree[index], PromptTree[index].options);

	socket.on("message", (message) => {
		console.log("message " + message);
		io.emit("message", message);
	});

	socket.on("vote", (vote) => {
		ManageVote(vote);
	});
	// this is needed so it dosent start sliding right away
	console.log("tick");
	setInterval(() => tick(), 1000);

	//io.emit("prompt", PromptTree[index], PromptTree[index].options);
	/*
    after 30 secounds io.emit new prompt
    find winner??
    clear votes  
    */
});

io.on("disconnected", (socket) => {
	console.log("Disconneted ");
});

http.listen(8080, () => console.log("listening on http://localhost:8080"));
