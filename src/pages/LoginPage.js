import { useState } from 'react';
import Card from "../components/ui/js/Card";
import classes from "./LoginPage.module.css";
import card_classes from "../components/ui/css/Card.module.css"
import Backdrop from "../components/ui/js/Backdrop";
import LoginErrorDialog from "../components/ui/js/LoginErrorDialog";
import SumbitButton from '../components/ui/js/SumbitButton';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const [IsErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

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

    function logIn() {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userNameText })
        };
        fetch("/login", requestOptions).then(reponse =>
            reponse.json().then(data => {

                if (data.user == "") {
                    setDialogMessage(["User not found. Please ", <a href="/signup">Sign Up!</a>])
                    showCloseHandler();
                } else {
                    navigate("/movie", { state: { current_user: data.user } });
                }
            }
            )
        )
    }

    return (
        <div>
            <Card stylecard={card_classes.logincard}>
                <div className={classes.login}>
                    <div className={classes.welcome_logo}>Welcome to Movie Explorer!</div>
                    <div>Login to your account or <a href='/signup'>Sign up</a></div>

                    <input className={classes.username}
                        type="text"
                        placeholder='Enter Username'
                        onChange={setUserName}
                        onKeyPress={event => {
                            if (event.key == 'Enter' && userNameText !== "") {
                                logIn();
                            }
                        }}
                    />

                    <SumbitButton onClick={(userNameText !== "") && logIn} />

                    {IsErrorDialogOpen && <LoginErrorDialog onCancel={hideCloseHandler} message={dialogMessage} />}
                    {IsErrorDialogOpen && <Backdrop onClick={hideCloseHandler} />}
                </div>
            </Card>
        </div>
    );


}

export default LoginPage