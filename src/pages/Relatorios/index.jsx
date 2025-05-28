import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Sidebar from "../../components/Sidebar";
import * as C from "./styles";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Relatorios = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const relatorios = [
    { nome: "Relatório de Vendas", endpoint: "vendas" },
    { nome: "Clientes Devedores", endpoint: "clientes-devedores" },
    { nome: "Ticket Médio", endpoint: "ticket-medio" },
    { nome: "Relatório DRE", endpoint: "dre" },
    { nome: "Consumo", endpoint: "consumo" },
    { nome: "Aniversariantes do Mês", endpoint: "aniversariantes" },
  ];

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
      setUser(decoded);
      return token;
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = getToken();
    return token
      ? { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      : {};
  };

  const handleDownload = async (endpoint) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/relatorios/${endpoint}`,
        getRequestConfig()
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${endpoint}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao baixar relatório.");
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Relatórios</C.Title>
        <C.CardContainer>
          {relatorios.map((rel, idx) => (
            <C.Card key={idx} onClick={() => handleDownload(rel.endpoint)}>
              <FileText size={40} color="#007bff" />
              <span>{rel.nome}</span>
            </C.Card>
          ))}
        </C.CardContainer>
      </C.Content>
    </C.Container>
  );
};

export default Relatorios;
