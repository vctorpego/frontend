import React, { useState, useEffect } from "react";
import * as C from "./styles";
import { Edit } from "lucide-react";
import Modal from "../Modal"; // Reutilizando o componente Modal
import Input from "../Input"; // Componente de input reutilizável

const ModalEditar = ({ produto, onClose, onSave, open }) => {
  const [produtoEditado, setProdutoEditado] = useState(produto || {});

  // Atualiza os dados do produto quando o modal é aberto
  useEffect(() => {
    setProdutoEditado(produto);
  }, [produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <C.Container>
        <Edit size={56} className="icon" />
        <C.Message>
          <h3>Editar Produto</h3>
          {/* Exibe o nome do produto sendo editado */}
          <p>Produto: <strong>{produtoEditado?.nome}</strong></p>
          <p>Altere as informações do produto abaixo:</p>
        </C.Message>
        
        <div>
          <Input
            type="text"
            placeholder="Preço de Venda"
            value={produtoEditado?.precoProduto}
            name="precoProduto"
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Preço de Custo"
            value={produtoEditado?.valorDeCustoProduto}
            name="valorDeCustoProduto"
            onChange={handleChange}
          />
          {/* Outros campos podem ser adicionados conforme necessário */}
        </div>

        <C.Buttons>
          <button className="save" onClick={() => onSave(produtoEditado)}>Salvar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </C.Buttons>
      </C.Container>
    </Modal>
  );
};

export default ModalEditar;
