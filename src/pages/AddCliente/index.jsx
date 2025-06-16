import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Container, Title, Form, Input, Button, Label, Message } from '../AddProduto/styles';
import useCardScanner from "../../hooks/useCardScanner";

const AddCliente = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [saldoCliente, setSaldoCliente] = useState("");
  const [limiteCliente, setLimiteCliente] = useState("");
  const [dtNascCliente, setDtNascCliente] = useState("");
  const [codigoCartao, setCodigoCartao] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useCardScanner((codigoLido) => {
    setCodigoCartao(codigoLido);
  });

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwt_decode(token);
      const userLogin = decoded.sub;

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Clientes"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPostPermission = permissoes.includes("POST");

        setHasPermission(hasPostPermission);

        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/nao-autorizado");
      }
    };

    verificarPermissao();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeCliente || !saldoCliente || !limiteCliente || !dtNascCliente || !codigoCartao) {
      setMessageType("info");
      setMessage("PReencha todos os campos!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessageType("error");
      setMessage("Você precisa estar logado!");
      localStorage.removeItem("token");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/cliente",
        {
          nomeCliente,
          saldoCliente: parseFloat(saldoCliente),
          limiteCliente: parseFloat(limiteCliente),
          dtNascCliente,
          idCartaoCliente: codigoCartao,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessageType("success");
        setMessage("Cliente Adicionado com Sucesso!");
        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao adicionar o cliente:", error);
      if (error.response) {

        if (error.response.status === 401) {
          setMessageType("error");
          setMessage("Cliente já cadastrado");

        } else if (error.response.status === 500) {
          setMessageType("error");
          setMessage("Erro interno do servidor");
        } else {
          setMessageType("error");
          setMessage("Erro ao adicionar cliente");
        }
      } else {
        setMessageType("error");
        setMessage("Erro ao se comunicar com o servidor");
      }
    }
  };

  if (!hasPermission) {
    return null; // ou um loader, se preferir
  }

  return (
    <Container>
      <Title>Adicionar Cliente</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Cliente:</Label>
          <Input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Nome do Cliente"
            required
          />
        </div>
        <div>
          <Label>Saldo do Cliente:</Label>
          <Input
            type="number"
            value={saldoCliente}
            onChange={(e) => setSaldoCliente(e.target.value)}
            placeholder="Saldo do Cliente"
            required

          />
        </div>
        <div>
          <Label>Limite de Crédito:</Label>
          <Input
            type="number"
            value={limiteCliente}
            onChange={(e) => setLimiteCliente(e.target.value)}
            placeholder="Limite de Crédito"
            required
          />
        </div>
        <div>
          <Label>Data de Nascimento:</Label>
          <Input
            type="date"
            value={dtNascCliente}
            onChange={(e) => setDtNascCliente(e.target.value)}
            placeholder="Data de Nascimento"
            required
          />
        </div>
        <div>
          <Label>Código do Cartão:</Label>
          <Input
            type="text"
            value={codigoCartao}
            onChange={(e) => setCodigoCartao(e.target.value)}
            placeholder="Passe o cartão ou digite o código"
            required
          />
        </div>
        <Button type="submit">Adicionar Cliente</Button>
      </Form>
    </Container>
  );
};

export default AddCliente;