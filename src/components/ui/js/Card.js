import classes from "../css/Card.module.css"

function Card(prop) {

    return (<div className={prop.stylecard}>
        {prop.children}
    </div>);

}

export default Card