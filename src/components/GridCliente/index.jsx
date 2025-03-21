import React from "react";
import { Edit, Trash2 } from "lucide-react";
import * as C from "./styles";

const Grid = ({ data, columns, handleDelete, handleEdit }) => {
  console.log(data);

  // Mapeamento das colunas para as propriedades dos clientes
  const columnMap = {
    "Cliente": "nomeCliente",  
    "ID": "idCliente",  // Mudado para refletir a propriedade correta do cliente
    "Data de Nascimento": "dtNascCliente",  
    "Ultima Compra": "ultimaCompraCliente",
    "Saldo": "saldoCliente",
    "Limite": "limiteCliente"
  };

  return (
    <C.Grid>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <C.TableHeader key={index}>{column}</C.TableHeader>
          ))}
          <C.TableHeader>Ações</C.TableHeader> {/* Adicionando cabeçalho de ações */}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((cliente) => (  // Renomeado para cliente em vez de produto
            <tr key={cliente.idCliente}>  
              {columns.map((column) => (
                <C.TableCell key={column}>
                  {cliente?.[columnMap[column]] ?? "-"}  {/* Mapeia o campo da coluna para o objeto cliente */}
                </C.TableCell>
              ))}
              <C.TableCell>
                {/* Botão de edição */}
                <button
                  onClick={() => handleEdit(cliente.idCliente)}  // Usando idCliente
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Edit style={{ color: 'blue', fontSize: '18px' }} />
                </button>

                {/* Botão de exclusão */}
                <button
                  onClick={() => handleDelete(cliente.idCliente)}  // Usando idCliente
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 style={{ color: 'red', fontSize: '18px' }} />
                </button>
              </C.TableCell>
            </tr>
          ))
        ) : (
          <tr>
            <C.TableCell colSpan={columns.length + 1}>Nenhum cliente encontrado.</C.TableCell> {/* Alterado para cliente */}
          </tr>
        )}
      </tbody>
    </C.Grid>
  );
};

export default Grid;
