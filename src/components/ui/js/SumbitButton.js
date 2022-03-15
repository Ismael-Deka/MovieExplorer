import classes from "../css/SumbitButton.module.css"

function SumbitButton(prop) {

    function clickHandler() {
        prop.onClick();
    }

    return (
        <div className={classes.actions} type="submit">
            <button onClick={clickHandler} >Sumbit</button>
        </div>);
}

export default SumbitButton;