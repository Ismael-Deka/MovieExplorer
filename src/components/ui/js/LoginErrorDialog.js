import classes from "../css/LoginErrorDialog.module.css";

function LoginErrorDialog(props) {

    function cancelHandler() {
        props.onCancel();
        if (props.isRedirect == true) {
            props.onRedirect()
        }
    }


    return (
        <div className={classes.errordialog}>
            <p>{props.message}</p>
            <button className={classes.btn} onClick={cancelHandler}>Close</button>


        </div >
    );
}

export default LoginErrorDialog