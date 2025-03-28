import * as C from "./styles";
import { Trash } from "react-feather";
import Modal from "../Modal";

const ModalExcluir = ({ onClose, onConfirm, open }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <C.Container>
        <Trash size={56} className="icon" />
        <C.Message>
          <h3>Confirmar Exclusão</h3>
          <p>Deseja realmente excluir o item <strong>{}</strong>?</p>
        </C.Message>
        <C.Buttons>
          <button className="delete" onClick={onConfirm}>Excluir</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </C.Buttons>
      </C.Container>
    </Modal>
  );
};

export default ModalExcluir;
