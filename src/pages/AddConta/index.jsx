import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label } from '../AddConta/styles';

const AddConta = () => {
  const [dtVencimento, setDtVencimento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("Não Paga");
  const [fornecedorId, setFornecedorId] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Você precisa estar logado!");
          navigate("/auth/login");
          return;
        }

        // Adicionando o token no cabeçalho da requisição
        const response = await axios.get("http://localhost:8080/fornecedor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Certifique-se de que a resposta tem a estrutura correta
        console.log(response.data); // Verifique se o que chega da API tem a propriedade 'id' e 'nome'
        setFornecedores(response.data); // Armazenando os fornecedores no estado
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
        alert("Erro ao carregar fornecedores.");
      }
    };

    fetchFornecedores();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se todos os campos estão preenchidos
    if (!dtVencimento || !descricao || !valor || !fornecedorId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      // Decodificando o token para verificar se ele é válido
      const decodedToken = jwt_decode(token);

      // Verifica se o token está expirado
      const currentTime = Date.now() / 1000; // Em segundos
      if (decodedToken.exp < currentTime) {
        alert("O token expirou. Por favor, faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      // Envia a requisição para adicionar a conta
      const response = await axios.post(
        "http://localhost:8080/controlecontas",
        {
          dtVencimentoControleContas: dtVencimento,
          descricaoControleContas: descricao,
          valorControleContas: parseFloat(valor),
          statusControleContas: status,
          fornecedor: { idFornecedor: parseInt(fornecedorId, 10) } // Converte o ID do fornecedor para número
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Conta adicionada com sucesso!");
        navigate("/pagamentos");

      }
    } catch (error) {
      console.error("Erro ao adicionar a conta:", error);

      if (error.response) {
        if (error.response.status === 409) {
          alert("Erro: A conta já foi cadastrada.");
        } else if (error.response.status === 401) {
          alert("Token inválido ou expirado. Por favor, faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
        } else if (error.response.status === 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert("Erro ao adicionar a conta: " + error.response.data);
        }
      } else {
        alert("Erro ao se comunicar com o servidor.");
      }
    }
  };

  return (
    <Container>
      <Title>Adicionar Nova Conta</Title>
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
          <select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)} // Aqui você define o ID do fornecedor
            required
          >
            <option value="">Selecione um Fornecedor</option>
            {fornecedores && fornecedores.length > 0 ? (
              fornecedores.map((fornecedor) => (
                <option key={fornecedor.idFornecedor} value={fornecedor.idFornecedor}> {/* Aqui você passa o ID do fornecedor */}
                  {fornecedor.nomeSocialFornecedor}  {/* Aqui você exibe o nome do fornecedor */}
                </option>
              ))
            ) : (
              <option value="">Nenhum fornecedor encontrado</option>
            )}
          </select>

        </div>
        <div>
          <Label>Status:</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Não Paga">Não Paga</option>
            <option value="Paga">Paga</option>
          </select>
        </div>
        <Button type="submit">Adicionar Conta</Button>
      </Form>
    </Container>
  );
};

export default AddConta;
