import Card from "../components/ui/js/Card";
import card_classes from "../components/ui/css/Card.module.css";
import DeleteCommentList from "../components/comments/js/DeleteCommentList";
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

function AccountPage() {
    const { state } = useLocation();
    const { current_user } = state;

    const [comments, setComments] = useState([]);

    function getUserComments() {
        fetch("/fetch_comments/" + current_user).then(reponse =>
            reponse.json().then(data => {
                setComments(data.comments)
            }
            )
        )
    }

    useEffect(() => {
        getUserComments();
    }, []);

    return (
        <Card stylecard={card_classes.logincard}>
            <DeleteCommentList current_user={current_user} comments={comments} />
        </Card>);
}


export default AccountPage