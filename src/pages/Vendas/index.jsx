import { useState } from "react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner"; // Importa o hook
import * as C from "./styles"; // Importando os componentes estilizados

function Vendas() {
  const [scannedCode, setScannedCode] = useState(""); // Armazena o código de barras escaneado
  const [produtos, setProdutos] = useState([]); // Lista de produtos escaneados

  const handleScan = async (code) => {
    console.log("Código escaneado:", code);
    setScannedCode(code);

    try {
      const response = await fetch(`http://localhost:8080/produtos/${code}`);
      
      if (response.ok) {
        const produto = await response.json(); // Recebe o produto encontrado
        console.log("Produto encontrado:", produto); // Verifique se o produto foi encontrado
        setProdutos((prev) => [...prev, produto]); // Adiciona o produto à lista
      } else {
        console.log("Produto não encontrado!"); // Caso não encontre o produto
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error); // Captura erros na requisição
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
