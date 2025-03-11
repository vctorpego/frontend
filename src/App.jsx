import logo from "./assets/logo.svg";
import "./global.css";

export function App() {
    return (
        <div className="container">
            <div className="sidebar">
                <h1>Bem-vindo!</h1>
                <img src={logo} alt="techmeal" />
            </div>

            <div className="content">
                <h2>INSIRA NOME DE USUÁRIO E SENHA </h2>

                <div className="form">
                    <div className="input-box">
                        <label htmlFor="nome">Nome</label>
                        <input type="text" name="nome" id="nome" placeholder="João" />
                    </div>

                    <div className="input-box">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" name="senha" id="senha" placeholder="********" />
                    </div>

                </div>

                <div class="button">
                    <button type="submit" class="btn">ENTRAR</button>
                </div>
            </div>
        </div>
    );
}
