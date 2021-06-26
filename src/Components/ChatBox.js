function toarray(string) {
	string = string.split("^");
	var stringArray = new Array();
	for (var i = 0; i < string.length; i++) {
		stringArray.push(string[i]);
		if (i != string.length - 1) {
			stringArray.push(" ");
		}
	}
	return stringArray;
}

function ChatBox(props) {
	return (
		<div>
			{toarray(props.Log).map((mess, index) => (
				<li key={index}>{mess}</li>
			))}
		</div>
	);
}

/*
		<div>
			<div className="chat-box">
				<div className={styles.open}>
					Open
					<div className={styles.box}></div>
				</div>
			</div>

*/

export default ChatBox;
