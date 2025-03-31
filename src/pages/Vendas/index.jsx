import { useState } from "react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner"; // Hook para scanner
import axios from "axios"; // Para requisições HTTP
import jwt_decode from "jwt-decode"; // Para decodificar o token
import { useNavigate } from "react-router-dom"; // Para navegação
import * as C from "./styles"; // Importa os estilos do arquivo styles.jsx

function Vendas() {
  const [clienteId, setClienteId] = useState(""); // ID do cliente digitado
  const [cliente, setCliente] = useState(null); // Dados do cliente
  const [scannedCode, setScannedCode] = useState(""); // Código escaneado
  const [produtos, setProdutos] = useState([]); // Lista de produtos escaneados
  const navigate = useNavigate();

  // Função para obter o token do localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado. Redirecionando para login...");
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
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  // Função para buscar o cliente pelo ID digitado
  const buscarCliente = async () => {
    if (!clienteId) {
      alert("Digite um ID de cliente!");
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(`http://localhost:8080/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCliente(response.data);
        setProdutos([]); // Reseta os produtos escaneados ao trocar de cliente
        console.log("Cliente encontrado:", response.data);
      } else {
        alert("Cliente não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      alert("Erro ao buscar cliente!");
    }
  };

  // Função para tratar o escaneamento do código de barras
  const handleScan = async (code) => {
    if (!cliente) {
      alert("Busque um cliente antes de escanear produtos!");
      return;
    }

    console.log("Código escaneado:", code);
    setScannedCode(code);

    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(`http://localhost:8080/produto/codigobarras/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setProdutos((prev) => [...prev, response.data]);
        console.log("Produto encontrado:", response.data);
      } else {
        console.log("Produto não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  useBarcodeScanner(handleScan); // Ativa o scanner de código de barras

  return (
    <C.Container>
      <C.Title>Nova Comanda  - TechMeal</C.Title>

      {/* Campo para buscar cliente */}
      <div>
        <C.Input
          type="text"
          placeholder="Digite o ID do cliente..."
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />

        <C.Button onClick={buscarCliente}>Buscar Cliente</C.Button>

      </div>

      {/* Exibe o nome do cliente, se encontrado */}
      {cliente && <h2>Cliente: {cliente.nomeCliente}</h2>}

      {/* Exibe os produtos escaneados */}
      {produtos.length === 0 ? (
        <C.Description>Nenhum produto escaneado ainda.</C.Description>
      ) : (
        <C.ProductList>
          {produtos.map((produto, index) => (
            <C.ProductItem key={index}>
              <span>{produto.nomeProduto}</span>
              <C.ProductPrice>R$ {produto.precoProduto}</C.ProductPrice>
            </C.ProductItem>
          ))}
        </C.ProductList>
      )}
    </C.Container>
  );
}

export default Vendas;
