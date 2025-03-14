import React from "react";
import Panel from "../../components/Panel/panel";
import LoginForm from "../../components/LoginForm/loginForm";
import styles from "./login.css";

const Login = () => {
    return (
        <div className={styles.container}>
            <Panel />
            <LoginForm />
        </div>
    );
};

export default Login;