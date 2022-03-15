function Comment(props) {

    return (
        <div>
            <div>User: {props.user} -- Rating: {props.rating}/5</div>
            <div>{props.comment}</div>
        </div>
    )
}

export default Comment