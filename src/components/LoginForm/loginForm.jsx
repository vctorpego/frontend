import React from "react";
import useLogin from "../../hooks/useLogin";
import Input from "../Input";
import Button from "../Button";
import styles from "./LoginForm.css";

const LoginForm = () => {
    const { email, setEmail, senha, setSenha, error, handleLogin } = useLogin();

    return (
        <div className={styles.content}>
            <h2>INSIRA NOME DE USUÁRIO E SENHA</h2>
            <div className={styles.form}>
                <Input
                    type="text"
                    id="email"
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    id="senha"
                    label="Senha"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                {error && <p className={styles.error}>{error}</p>}
                <Button onClick={handleLogin}>ENTRAR</Button>
            </div>
        </div>
    );
};

export default LoginForm;