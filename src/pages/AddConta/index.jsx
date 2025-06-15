import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  Label,
  Select, Message
} from "../AddConta/styles";

const AddConta = () => {
  const [dtVencimento, setDtVencimento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("Não Paga");
  const [fornecedorId, setFornecedorId] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");


  const navigate = useNavigate();

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
          (perm) => perm.tela === "Tela de Pagamentos"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPostPermission = permissoes.includes("POST");

        setHasPermission(hasPostPermission);

        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        } else {
          const fornecedoresResp = await axios.get(
            "http://localhost:8080/fornecedor",
            getRequestConfig()
          );
          setFornecedores(fornecedoresResp.data);
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

    if (!dtVencimento || !descricao || !valor || !fornecedorId) {
      setMessageType("info");
      setMessage("Preencha todos os campos!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/controlecontas",
        {
          dtVencimentoControleContas: dtVencimento,
          descricaoControleContas: descricao,
          valorControleContas: parseFloat(valor),
          statusControleContas: status,
          fornecedor: { idFornecedor: parseInt(fornecedorId, 10) },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessageType("success");
        setMessage("Conta adicionada com sucesso!!");
        setTimeout(() => navigate("/pagamentos"), 2000);
      }
    } catch (error) {
      console.error("Erro ao adicionar conta:", error);
      if (error.response) {
        if (error.response.status === 409) {
          setMessageType("error");
          setMessage("A conta já foi cadastrada!");
        } else if (error.response.status === 401) {
          setMessageType("error");
          setMessage("Token Expirado!");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/auth/login"), 2000);
        } else {
          setMessageType("error");
          setMessage("Erro ao adicionar conta!");
          setTimeout(() => navigate("/pagamentos"), 2000);

        }
      } else {
        setMessageType("error");
        setMessage("Erro de comunicação com o servidor!");
        setTimeout(() => navigate("/pagamentos"), 2000)
      }
    }
  };

  if (!hasPermission) return null;

  return (
    <Container>
      <Title>Adicionar Nova Conta</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Data de Vencimento:</Label>
          <Input
            type="date"
            value={dtVencimento}
            onChange={(e) => setDtVencimento(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Descrição:</Label>
          <Input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição da Conta"
            required
          />
        </div>

        <div>
          <Label>Valor:</Label>
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor da Conta"
            required
          />
        </div>

        <div>
          <Label>Fornecedor:</Label>
          <Select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            required
          >
            <option value="">Selecione um Fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.idFornecedor} value={f.idFornecedor}>
                {f.nomeSocialFornecedor}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Status:</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Não Paga">Não Paga</option>
            <option value="Paga">Paga</option>
          </Select>
        </div>

        <Button type="submit">Adicionar Conta</Button>
      </Form>
    </Container>
  );
};

export default AddConta;
