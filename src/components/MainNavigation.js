import classes from "./MainNavigation.module.css"
import { Link } from "react-router-dom"

function MainNavigation() {


    return (
        <header className={classes.header}>

            <div className={classes.logo} onClick>Movie Explorer</div>



        </header>
    );
}

export default MainNavigation