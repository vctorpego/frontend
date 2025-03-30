import React from "react";
import { Edit, Trash2, Printer } from "lucide-react"; // Importando ícones adicionais
import * as C from "./styles";
import Button from "../../components/Button"; // Certifique-se de importar o componente Button

const Grid = ({ 
  data, 
  columns, 
  columnMap, 
  handleDelete, 
  handleEdit, 
  handlePrint, 
  handlePay, 
  idKey, 
  actions = ["edit", "delete"] // Define as ações a serem exibidas, com "edit" e "delete" como padrão
}) => {
  // Função para acessar valores aninhados no objeto com validações
  const getNestedValue = (obj, path) => {
    if (typeof path === "string" && path.trim()) {
      return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "-";
    }
    return "-";
  };

  // Função para renderizar ícones de ações com base nas escolhas
  const renderActions = (item) => {
    return (
      <>
        {actions.includes("edit") && (
          <C.ActionButton onClick={() => handleEdit(item[idKey])}>
            <Edit style={{ color: "blue", fontSize: "18px" }} />
          </C.ActionButton>
        )}
        {actions.includes("delete") && (
          <C.ActionButton onClick={() => handleDelete(item[idKey])}>
            <Trash2 style={{ color: "red", fontSize: "18px" }} />
          </C.ActionButton>
        )}
        {actions.includes("print") && (
          <C.ActionButton onClick={() => handlePrint(item[idKey])}>
            <Printer style={{ color: "green", fontSize: "18px" }} />
          </C.ActionButton>
        )}
        {actions.includes("pay") && (
          <C.ActionButton onClick={() => handlePay(item[idKey])}>
            <Button Text="Pagar" onClick={() => handlePay(item[idKey])} />
          </C.ActionButton>
        )}
      </>
    );
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
                {renderActions(item)} {/* Renderiza as ações baseadas nas escolhas */}
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
