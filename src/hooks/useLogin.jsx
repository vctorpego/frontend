import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./userAuth";

const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!email || !senha) {
            setError("Preencha todos os campos");
            return;
        }

        const res = login(email, senha);

        if (res) {
            setError(res);
            return;
        }

        navigate("/home");
    };

    return {
        email,
        setEmail,
        senha,
        setSenha,
        error,
        handleLogin,
    };
};

export default useLogin;