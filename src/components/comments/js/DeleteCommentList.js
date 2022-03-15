import classes from "../css/CommentList.module.css";
import Comment from "./Comment";
import { useNavigate } from 'react-router-dom';

function DeleteCommentList(props) {

    let navigate = useNavigate();

    function deleteCommentById(id) {
        console.log(id)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment_id: id })
        };

        fetch("/delete_comment", requestOptions).then(reponse =>
            reponse.json().then(data => {

                navigate("/movie", { state: { current_user: props.user } });
            }
            )
        )
    }

    return (
        <div className={classes.commentlist}>
            <div id="comment_length">{props.length} Comment(s)</div>
            {props.comments.map(comment =>
                <div>
                    <Comment
                        user={comment.user}
                        rating={comment.rating}
                        comment={comment.comment}

                    />

                    <button onClick={event => {
                        deleteCommentById(comment.id)
                    }}>Delete</button>
                </div>
            )
            }
        </div>
    );


}

export default DeleteCommentList