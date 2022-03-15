import classes from "./MovieItem.module.css"

function MovieItem(props) {
    return (
        <div className={classes.item}>
            <div className={classes.image}>
                <img className={classes.poster} src={props.src} />
            </div>
            <div className={classes.content}>
                <h3>{props.title}</h3>
                <address>{props.tag_line}</address>
                <p>{props.genre}</p>
                <a href={props.wiki}>Click Here to learn more about this movie.</a>
            </div>

        </div>)
}

export default MovieItem