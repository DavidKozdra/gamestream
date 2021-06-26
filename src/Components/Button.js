
function Button(props) {

	return (
		<button disabled={props.voted} onClick={props.click}>
            {props.text}
            {props.image && 
            <div>
                <img src={props.imagepath} alt=""></img>
            </div>}
		</button>
	);
}

export default Button;