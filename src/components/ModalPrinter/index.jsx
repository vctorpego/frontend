import * as C from "./styles";
import { Printer } from "react-feather";
import Modal from "../Modal";
import { useState } from "react";

const ModalPrinter = ({ open, onClose, onConfirm }) => {
  const [quantidade, setQuantidade] = useState(1);

  const incrementar = () => setQuantidade(prev => prev + 1);
  const decrementar = () => {
    if (quantidade > 1) setQuantidade(prev => prev - 1);
  };

  const confirmarImpressao = () => {
    onConfirm(quantidade);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <C.Container>
        <Printer size={56} className="icon" />
        <C.Message>
          <h3>Imprimir Código de Barras</h3>
          <p>Escolha o número de cópias para impressão:</p>
        </C.Message>

        <C.Counter>
          <button onClick={decrementar}>-</button>
          <span>{quantidade}</span>
          <button onClick={incrementar}>+</button>
        </C.Counter>

        <C.Buttons>
          <button className="print" onClick={confirmarImpressao}>Imprimir</button>
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </C.Buttons>
      </C.Container>
    </Modal>
  );
};

export default ModalPrinter;
