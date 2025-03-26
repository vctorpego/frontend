import React, { useEffect } from "react";
import * as C from "./styles";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal"; // Reutilizando o componente Modal

const ModalEditar = ({ produto, onClose, open }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!produto) return;
  }, [produto]);

  const handleRedirect = () => {
    navigate(`/editar-produto/${produto.idProduto}`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <C.Container>
        <Edit size={56} className="icon" />
        <C.Message>
          <h3>Editar Produto</h3>
          {/* Exibe o nome do produto sendo editado */}
          <p>Produto: <strong>{produto?.nomeProduto}</strong></p>
          <p>Redirecionando para a tela de edição...</p>
        </C.Message>

        <C.Buttons>
          <button className="edit" onClick={handleRedirect}>Editar</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </C.Buttons>
      </C.Container>
    </Modal>
  );
};

export default ModalEditar;
