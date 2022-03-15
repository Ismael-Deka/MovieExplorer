import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import MovieItem from "../components/MovieItem";
import CommentForm from "../components/comments/js/CommentForm";
import CommentList from "../components/comments/js/CommentList";
import Card from "../components/ui/js/Card";
import classes from "./MoviePage.module.css"
import card_classes from "../components/ui/css/Card.module.css"



function MoviePage() {

    const { state } = useLocation();

    const { current_user } = state;

    const [comment_length, setCommentLength] = useState("");

    const [image_source, setImageSource] = useState("");

    const [title, setTitle] = useState("");

    const [tag_line, setTagLine] = useState("");

    const [genre, setGenre] = useState("");

    const [wiki, setWiki] = useState("");

    const [movie_id, setMovieId] = useState("");

    const [comments, setComments] = useState([]);

    function getMovieDetails() {
        fetch("/movie/fetch_movie").then(reponse =>
            reponse.json().then(data => {
                setCommentLength(data.len)
                setImageSource(data.poster);
                setTitle(data.title);
                setTagLine(data.overview);
                setGenre(data.genre);
                setWiki(data.wiki);
                setMovieId(data.movie_id)
                setComments(data.comments)
            }
            )
        )
    }
    useEffect(() => {
        getMovieDetails();
    }, []);

    return (
        <div className={classes.flexbox_row}>
            <Card stylecard={card_classes.postercard}>
                <MovieItem
                    src={image_source}
                    title={title}
                    tag_line={tag_line}
                    genre={genre}
                    wiki={wiki} />
            </Card>
            <div className={classes.flexbox_column}>
                <Card stylecard={card_classes.commentform}>
                    <CommentForm user={current_user} movie_id={movie_id} />
                    <CommentList length={comment_length} comments={comments} />
                </Card>

            </div>
        </div>
    );
}


export default MoviePage