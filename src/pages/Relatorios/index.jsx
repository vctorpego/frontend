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
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [ticketInicio, setTicketInicio] = useState("");
  const [ticketFim, setTicketFim] = useState("");
  const [pendingDownload, setPendingDownload] = useState(null);
  const [showAniversarioPopup, setShowAniversarioPopup] = useState(false);
  const [aniversarioDia, setAniversarioDia] = useState("");
  const [aniversarioMes, setAniversarioMes] = useState("");
  const [pendingAniversarioDownload, setPendingAniversarioDownload] = useState(null);

  const relatorios = [
    { nome: "Relatório de Vendas", endpoint: "" },
    { nome: "Clientes Devedores", endpoint: "" },
    { nome: "Ticket Médio", endpoint: "ticket-medio-clientes" },
    { nome: "Relatório DRE", endpoint: "" },
    { nome: "Consumo", endpoint: "" },
    { nome: "Aniversariantes do Mês", endpoint: "aniversariantes-dia" },
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

  const handleDownload = async (endpoint, params = {}) => {
    try {
      let url = `http://localhost:8080/relatorios/${endpoint}`;
      // Se for ticket-medio-clientes, envie como query string
      if (endpoint === "ticket-medio-clientes" && params.inicio && params.fim) {
        url += `?inicio=${encodeURIComponent(params.inicio)}&fim=${encodeURIComponent(params.fim)}`;
      }
      // Se for aniversariantes-dia, envie como query string
      if (endpoint === "aniversariantes-dia" && params.dia && params.mes) {
        url += `?dia=${encodeURIComponent(params.dia)}&mes=${encodeURIComponent(params.mes)}`;
      }
      const response = await axios.post(
        url,
        (endpoint === "ticket-medio-clientes" || endpoint === "aniversariantes-dia") ? {} : params,
        getRequestConfig()
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${endpoint}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao baixar relatório.");
    }
  };

  const handleCardClick = (rel) => {
    if (rel.endpoint === "ticket-medio-clientes") {
      setShowTicketPopup(true);
      setPendingDownload(rel.endpoint);
    } else if (rel.endpoint === "aniversariantes-dia") {
      setShowAniversarioPopup(true);
      setPendingAniversarioDownload(rel.endpoint);
    } else {
      handleDownload(rel.endpoint);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketInicio || !ticketFim) {
      alert("Preencha as duas datas.");
      return;
    }
    setShowTicketPopup(false);
    handleDownload(pendingDownload, { inicio: ticketInicio, fim: ticketFim });
    setTicketInicio("");
    setTicketFim("");
    setPendingDownload(null);
  };

  const handleAniversarioSubmit = (e) => {
    e.preventDefault();
    const dia = parseInt(aniversarioDia, 10);
    const mes = parseInt(aniversarioMes, 10);
    if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      alert("Informe um dia (1-31) e mês (1-12) válidos.");
      return;
    }
    setShowAniversarioPopup(false);
    handleDownload(pendingAniversarioDownload, { dia, mes });
    setAniversarioDia("");
    setAniversarioMes("");
    setPendingAniversarioDownload(null);
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
            <C.Card key={idx} onClick={() => handleCardClick(rel)}>
              <FileText size={40} color="#007bff" />
              <span>{rel.nome}</span>
            </C.Card>
          ))}
        </C.CardContainer>

        {showTicketPopup && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <form
              onSubmit={handleTicketSubmit}
              style={{
                background: "#fff",
                padding: 32,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 280
              }}
            >
              <h3>Informe o período</h3>
              <label>
                Data de início:
                <input
                  type="date"
                  value={ticketInicio}
                  onChange={e => setTicketInicio(e.target.value)}
                  required
                  style={{ marginLeft: 8 }}
                />
              </label>
              <label>
                Data de fim:
                <input
                  type="date"
                  value={ticketFim}
                  onChange={e => setTicketFim(e.target.value)}
                  required
                  style={{ marginLeft: 8 }}
                />
              </label>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowTicketPopup(false)}>Cancelar</button>
                <button type="submit">Baixar Relatório</button>
              </div>
            </form>
          </div>
        )}

        {showAniversarioPopup && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <form
              onSubmit={handleAniversarioSubmit}
              style={{
                background: "#fff",
                padding: 32,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 280
              }}
            >
              <h3>Informe dia e mês</h3>
              <label>
                Dia:
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={aniversarioDia}
                  onChange={e => setAniversarioDia(e.target.value)}
                  required
                  style={{ marginLeft: 8 }}
                />
              </label>
              <label>
                Mês:
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={aniversarioMes}
                  onChange={e => setAniversarioMes(e.target.value)}
                  required
                  style={{ marginLeft: 8 }}
                />
              </label>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowAniversarioPopup(false)}>Cancelar</button>
                <button type="submit">Baixar Relatório</button>
              </div>
            </form>
          </div>
        )}
      </C.Content>
    </C.Container>
  );
};

export default Relatorios;
