import React from "react";
import Logo from "../../assets/logo.svg";
import styles from "./panel.css";

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h1>Bem-vindo!</h1>
            <img src={Logo} alt="Techmeal" />
        </div>
    );
};

export default Sidebar;