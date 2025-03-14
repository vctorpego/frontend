import React from "react";
import styles from "./input.css";

const Input = ({ type, placeholder, value, onChange, label }) => {
    return (
        <div className={styles.inputBox}>
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;