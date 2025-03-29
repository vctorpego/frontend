import React from "react";
import { CreditCard, Edit, Trash2 } from "lucide-react";
import * as C from "./styles";

const Grid = ({ data, columns, columnMap, handleDelete, handleEdit, handlePay, idKey }) => {
  // Função para acessar valores aninhados no objeto com validações
  const getNestedValue = (obj, path) => {
    if (typeof path === "string" && path.trim()) {
      return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "-";
    }
    return "-";
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
                <C.ActionButton onClick={() => handleEdit(item[idKey])}>
                  <Edit style={{ color: "blue" }} />
                </C.ActionButton>
                <C.ActionButton onClick={() => handleDelete(item[idKey])}>
                  <Trash2 style={{ color: "red" }} />
                </C.ActionButton>
                <C.ActionButton onClick={() => handlePay(item[idKey])}>
                  <CreditCard style={{ color: "green" }} />
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
