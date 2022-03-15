import classes from "../css/CommentForm.module.css"
import SumbitButton from "../../ui/js/SumbitButton";
import LoginErrorDialog from "../../ui/js/LoginErrorDialog";
import Backdrop from "../../ui/js/Backdrop";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CommentForm(props) {



    let navigate = useNavigate();

    const [comment_text, setCommentText] = useState("");

    const [rating, setRating] = useState("1");

    const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    const [isRedirecting, setisRedirecting] = useState(false);

    const [dialogMessage, setDialogMessage] = useState("");

    function setComment(text) {
        console.log(text.target.value)
        setCommentText(text.target.value);
    }

    function grabRating(rate) {
        console.log(rate.target.value)
        setRating(rate.target.value);
    }

    function showCloseHandler() {
        setIsErrorDialogOpen(true);

    }

    function hideCloseHandler() {
        setIsErrorDialogOpen(false);
    }

    function navigateToAccountMngr() {
        navigate("/account", { state: { current_user: props.user } });
    }

    function postComment() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: comment_text, rating: rating })
        };
        fetch("/post/" + props.movie_id + "/" + props.user + "", requestOptions).then(reponse =>
            reponse.json().then(data => {

                if (data.comment_posted_success == false) {
                    setDialogMessage(["Comment failed to post. Please try again later."])
                    showCloseHandler();
                } else {
                    setDialogMessage(["Comment posted successfully. Refresh to update comments"])
                    showCloseHandler();
                    setisRedirecting(true);
                }
            }
            )
        )
    }

    return (
        <div className={classes.commentform}>
            <div className={classes.commentlogo}>
                Create a New Comment
            </div>
            <form>
                <textarea type="text"
                    style={{ resize: 'none' }}
                    className={classes.commentbox}
                    onChange={setComment}

                />

            </form>
            <div className={classes.commentoptions} type="submit">
                <div>Movie ID: {props.movie_id}</div>
                <div>Rating (out of 5)</div>
                <select name="rating" onChange={grabRating}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <SumbitButton onClick={postComment} />
                <div style={{ border: "1px solid", borderRadius: "4px" }} onClick={navigateToAccountMngr}>Manage your Comments</div>
            </div>
            {IsErrorDialogOpen && <LoginErrorDialog
                onCancel={hideCloseHandler}
                message={dialogMessage} />}
            {IsErrorDialogOpen && <Backdrop onClick={hideCloseHandler} />}
        </div>
    );
}

export default CommentForm