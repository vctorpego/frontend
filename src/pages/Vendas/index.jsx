import { useRef, useState } from "react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";

function Vendas() {
  const [clienteId, setClienteId] = useState("");
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [primeiroScan, setPrimeiroScan] = useState(true); // Flag para verificar o primeiro scan
  const navigate = useNavigate();

  const clienteInputRef = useRef(null);

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
        setProdutos([]);
        setValorTotal(0);
        setClienteId(""); // Limpa o campo de ID do cliente após a busca
        setPrimeiroScan(true); // Reset para indicar que o próximo scan será o primeiro
        console.log("Cliente encontrado:", response.data);
      } else {
        alert("Cliente não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      alert("Erro ao buscar cliente!");
    }
  };

  const handleScan = async (code) => {
    console.log("Código escaneado (antes da correção):", code);
    
    if (!cliente) {
      alert("Busque um cliente antes de escanear produtos!");
      return;
    }

    // Se for o primeiro scan, remover o primeiro caractere do código de barras
    if (primeiroScan && code.length > 1) {
      code = code.substring(1);
      setPrimeiroScan(false); // Desativa a flag após o primeiro scan
    }

    console.log("Código escaneado (após a correção):", code);

    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.get(`http://localhost:8080/produto/codigobarras/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setProdutos((prev) => [...prev, response.data]);
        setValorTotal((prevTotal) => prevTotal + response.data.precoProduto);
        console.log("Produto encontrado:", response.data);
      } else {
        console.log("Produto não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  useBarcodeScanner(handleScan);

  return (
    <C.Container>
      <C.Title>Nova Comanda - TechMeal</C.Title>
      <div>
        <C.Input
          ref={clienteInputRef}
          type="text"
          placeholder="Digite o ID do cliente..."
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <C.Button onClick={buscarCliente}>Buscar Cliente</C.Button>
      </div>
      {cliente && <h2>Cliente: {cliente.nomeCliente}</h2>}
      <h3>Valor Total: R$ {valorTotal.toFixed(2)}</h3>
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
