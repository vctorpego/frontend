import React from "react";
import styles from "./button.css";

const Button = ({ children, onClick }) => {
    return (
        <button className={styles.btn} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;