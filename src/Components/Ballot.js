
function Ballot(props) {
    var votes = props.votes;
    // this can be destructured
	return (

			<p>{ votes[0] + " " + votes[1] + " " + votes[2] + " " + votes[3] }</p>
	);
}

export default Ballot;