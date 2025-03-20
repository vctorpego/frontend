import React from "react";
import { Edit, Trash2 } from "lucide-react";  // Importando ícones de editar e excluir do Lucide
import * as C from "./styles";

const Grid = ({ data, columns, handleDelete, handleEdit }) => {
  return (
    <C.Grid>
      <thead>
        <tr>
          {/* Renderiza os cabeçalhos de acordo com as colunas */}
          {columns.map((column, index) => (
            <C.TableHeader key={index}>{column}</C.TableHeader>
          ))}
          <C.TableHeader>Ações</C.TableHeader> {/* Coluna de ações para editar e excluir */}
        </tr>
      </thead>
      <tbody>
        {data.map((cliente) => (
          <tr key={cliente.id}>
            {/* Renderiza as células de dados dinamicamente com base nas colunas */}
            {columns.map((column, index) => (
              <C.TableCell key={index}>
                {/* Exibe o valor da propriedade correspondente à coluna */}
                {cliente[column.toLowerCase().replace(" ", "")] || "-"}
              </C.TableCell>
            ))}
            <C.TableCell>
              <button onClick={() => handleEdit(cliente.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Edit style={{ color: 'blue', fontSize: '18px' }} /> {/* Ícone de editar do Lucide */}
              </button>
              <button onClick={() => handleDelete(cliente.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 style={{ color: 'red', fontSize: '18px' }} /> {/* Ícone de excluir do Lucide */}
              </button>
            </C.TableCell>
          </tr>
        ))}
      </tbody>
    </C.Grid>
  );
};

export default Grid;
