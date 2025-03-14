import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuth from "../../hooks/userAuth";
import "./styles.css";

const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2 className="title">Home</h2>
            <Button Text="Sair" onClick={() => [logout(), navigate("/")]}>
                Sair
            </Button>
        </div>
    );
};

export default Home;