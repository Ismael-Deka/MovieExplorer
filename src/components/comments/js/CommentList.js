import classes from "../css/CommentList.module.css";
import Comment from "./Comment";

function CommentList(props) {

    return (
        <div className={classes.commentlist}>
            <div id="comment_length">{props.length} Comment(s)</div>
            {props.comments.map(comment =>

                <Comment
                    user={comment.user}
                    rating={comment.rating}
                    comment={comment.comment}

                />

            )
            }
        </div>
    );


}

export default CommentList