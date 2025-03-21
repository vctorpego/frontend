import React from "react";
import { Edit, Trash2 } from "lucide-react";
import * as C from "./styles";

const Grid = ({ data, columns, handleDelete, handleEdit }) => {
  console.log(data);

  // Mapeamento das colunas para as propriedades dos produtos
  const columnMap = {
    "Nome": "nomeProduto",         // Nome do Produto
    "ID": "idProduto",             // ID do Produto
    "Preço de Custo": "valorDeCustoProduto",  // Preço de Custo
    "Preço": "precoProduto",       // Preço
    "Estoque": "quantProduto",     // Quantidade (Estoque)
    "Código de Barras": "codigoBarrasProduto" // Código de Barras
  };

  return (
    <C.Grid>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <C.TableHeader key={index}>{column}</C.TableHeader>
          ))}
          <C.TableHeader>Ações</C.TableHeader>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((produto) => (
            <tr key={produto.idProduto}>
              {columns.map((column) => (
                <C.TableCell key={column}>
                  {produto?.[columnMap[column]] ?? "-"} {/* Mapeia o campo da coluna para o objeto produto */}
                </C.TableCell>
              ))}
              <C.TableCell>
                <button
                  onClick={() => handleEdit(produto.idProduto)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Edit style={{ color: 'blue', fontSize: '18px' }} />
                </button>
                <button
                  onClick={() => handleDelete(produto.idProduto)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 style={{ color: 'red', fontSize: '18px' }} />
                </button>
              </C.TableCell>
            </tr>
          ))
        ) : (
          <tr>
            <C.TableCell colSpan={columns.length + 1}>Nenhum produto encontrado.</C.TableCell>
          </tr>
        )}
      </tbody>
    </C.Grid>
  );
};

export default Grid;
