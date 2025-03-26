import React from "react";
import { Edit, Trash2 } from "lucide-react";
import * as C from "./styles"; // Importando os estilos do arquivo separado

const Grid = ({ data, columns, columnMap, handleDelete, handleEdit }) => {
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "-";
  };

  return (
    <C.StyledTable>
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
          data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <C.TableCell key={colIndex} align="center">
                  {getNestedValue(item, columnMap[column])}
                </C.TableCell>
              ))}
              <C.TableCell align="center">
                <C.ActionButton onClick={() => handleEdit(item.idContaControleContas || item.id)}>
                  <Edit style={{ color: "blue" }} />
                </C.ActionButton>
                <C.ActionButton onClick={() => handleDelete(item.idContaControleContas || item.id)}>
                  <Trash2 style={{ color: "red" }} />
                </C.ActionButton>
              </C.TableCell>
            </tr>
          ))
        ) : (
          <tr>
            <C.TableCell colSpan={columns.length + 1} align="center">
              Nenhum dado encontrado.
            </C.TableCell>
          </tr>
        )}
      </tbody>
    </C.StyledTable>
  );
};

export default Grid;