import { useState } from "react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner"; // Importa o hook
import axios from "axios"; // Usando axios para fazer as requisições HTTP
import jwt_decode from "jwt-decode"; // Para decodificar o token
import * as C from "./styles"; // Importando os componentes estilizados
import { useNavigate } from "react-router-dom"; // Para navegação entre páginas

function Vendas() {
  const [scannedCode, setScannedCode] = useState(""); // Armazena o código de barras escaneado
  const [produtos, setProdutos] = useState([]); // Lista de produtos escaneados
  const navigate = useNavigate();

  // Função para pegar o token e configurar o cabeçalho da requisição
  const getToken = () => {
    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("token"));

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

  // Função para configurar as requisições com o token
  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {}; // Retorna um objeto vazio caso não tenha token
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Função para tratar o escaneamento do código de barras
  const handleScan = async (code) => {
    console.log("Código escaneado:", code);
    setScannedCode(code);
  
    try {
      const token = localStorage.getItem("token"); // Certifique-se de que o token está armazenado corretamente
  
      const response = await fetch(`http://localhost:8080/produto/codigobarras/${scannedCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const produto = await response.json();
        console.log("Produto encontrado:", produto);
        setProdutos((prev) => [...prev, produto]);
      } else {
        console.log("Produto não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };  

  useBarcodeScanner(handleScan); // Usa o hook para escanear o código de barras

  return (
    <C.Container>
      <C.Title>Ponto de Venda - Cafeteria</C.Title>
      <C.Description>Escaneie um código de barras...</C.Description>
      
      {produtos.length === 0 ? (
        <C.Description>Nenhum produto escaneado ainda.</C.Description>
      ) : (
        <C.ProductList>
          {produtos.map((produto, index) => (
            <C.ProductItem key={index}>
              <span>{produto.nomeProduto}</span> {/* Nome do produto */}
              <C.ProductPrice>R$ {produto.precoProduto}</C.ProductPrice> {/* Preço do produto */}
            </C.ProductItem>
          ))}
        </C.ProductList>
      )}
    </C.Container>
  );
}

export default Vendas;
