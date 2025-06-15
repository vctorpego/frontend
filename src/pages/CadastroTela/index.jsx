import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Container, Form, Input, Button } from './styles'; // ajuste se necessário
import { Message } from "../EditUsuario/styles";

const CadastroTela = () => {
  const [nomeTela, setNomeTela] = useState("");
  const [urlTela, setUrlTela] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
      return token;
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded = jwt_decode(token);
    const userLogin = decoded.sub;

    const verificarPermissao = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:8080/usuario/id/${userLogin}`, getRequestConfig());
        const userId = userResponse.data;

        const permissaoResponse = await axios.get(`http://localhost:8080/permissao/telas/${userId}`, getRequestConfig());
        const permissoes = permissaoResponse.data;

        const telaPermissao = permissoes.find(p => p.tela === "Tela de Tela");
        const temGet = telaPermissao?.permissoes?.includes("GET");

        setHasPermission(temGet);

        if (!temGet) {
          navigate("/nao-autorizado");
        }
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
      }
    };

    verificarPermissao();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeTela || !urlTela) {
      setMessageType("error");
      setMessage("Preencha todos os campos!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      const userLogin = decoded.sub;

      // 1. Buscar ID do usuário logado
      const userResponse = await axios.get(`http://localhost:8080/usuario/id/${userLogin}`, getRequestConfig());
      const idUsuario = userResponse.data;

      // 2. Criar nova tela
      const response = await axios.post("http://localhost:8080/tela", {
        nomeTela,
        urlTela,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        const novaTela = response.data;
        const idTela = novaTela.idTela;

        // 3. Vincular permissões ao usuário (GET, POST, PUT, DELETE = 1, 2, 3, 4)
        const permissoes = [1, 2, 3, 4];

        await Promise.all(permissoes.map(idPermissao =>
          axios.post(`http://localhost:8080/usuario/${idUsuario}/permissao?idTela=${idTela}&idPermissao=${idPermissao}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ));

        setMessageType("success");
        setMessage("Tela cadastrada com sucesso!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        setNomeTela("");
        setUrlTela("");
      }
    } catch (error) {
      console.error("Erro ao cadastrar tela ou associar permissões:", error);
      alert("Erro ao cadastrar tela ou associar permissões.");
      setMessageType("error");
      setMessage("Erro ao cadastrar tela!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  if (!hasPermission) {
    return <div>Verificando permissões...</div>;
  }

  return (
    <Container>
      <h2>Cadastro de Tela</h2>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome da Tela"
          value={nomeTela}
          onChange={(e) => setNomeTela(e.target.value)}
        />
        <Input
          type="text"
          placeholder="URL da Tela"
          value={urlTela}
          onChange={(e) => setUrlTela(e.target.value)}
        />
        <Button type="submit">Cadastrar</Button>
      </Form>
    </Container>
  );
};

export default CadastroTela;
