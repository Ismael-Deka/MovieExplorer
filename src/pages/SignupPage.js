import { useState } from 'react';
import Card from "../components/ui/js/Card";
import classes from "./LoginPage.module.css";
import card_classes from "../components/ui/css/Card.module.css"
import Backdrop from "../components/ui/js/Backdrop";
import LoginErrorDialog from "../components/ui/js/LoginErrorDialog";
import SumbitButton from '../components/ui/js/SumbitButton';
import { useNavigate } from 'react-router-dom';


function SignupPage() {

    const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

    const [isRedirecting, setisRedirecting] = useState(false);

    const [userNameText, setUserNameText] = useState("");

    const [dialogMessage, setDialogMessage] = useState("");


    let navigate = useNavigate();



    function setUserName(text) {
        setUserNameText(text.target.value);
    }

    function showCloseHandler() {
        setIsErrorDialogOpen(true);

    }

    function hideCloseHandler() {
        setIsErrorDialogOpen(false);

    }

    function signUp() {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userNameText })
        };
        fetch("/signup", requestOptions).then(reponse =>
            reponse.json().then(data => {

                if (data.user_already_exists === true) {
                    console.log(userNameText);
                    setDialogMessage(["That username is already in use. ", <a href="/">Log in.</a>])
                    showCloseHandler();
                } else if (data.account_created === true) {
                    setDialogMessage(["Account successfully created!"])
                    showCloseHandler();
                    setisRedirecting(true);
                }
            }
            )
        )
    }

    function redirectBackToLogin() {
        navigate("/");
    }

    return (
        <div>
            <Card stylecard={card_classes.logincard}>
                <div className={classes.login}>
                    <div className={classes.welcome_logo}>Sign up to Movie Explorer</div>
                    <div>Already have an account? <a href="/">Log in.</a></div>

                    <input className={classes.username} type="text"
                        placeholder='Enter Username'
                        onChange={setUserName}
                        onKeyPress={event => {
                            if (event.key === 'Enter' && userNameText !== "") {
                                console.log("userNameText");
                                signUp();
                            }
                        }} />

                    <SumbitButton onClick={(userNameText !== "") && signUp} />

                    {IsErrorDialogOpen && <LoginErrorDialog onCancel={hideCloseHandler} message={dialogMessage} onRedirect={redirectBackToLogin} isRedirect={isRedirecting} />}
                    {IsErrorDialogOpen && <Backdrop onClick={hideCloseHandler} />}
                </div>
            </Card>
        </div>);
}

export default SignupPage