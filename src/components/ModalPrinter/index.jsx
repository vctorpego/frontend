import * as C from "./styles";
import { Printer } from "react-feather";
import Modal from "../Modal";
import { useState } from "react";

const ModalPrinter = ({ open, onClose, onConfirm, codigo }) => {
  const [quantidade, setQuantidade] = useState(3);

  const incrementar = () => setQuantidade(prev => prev + 3);
  const decrementar = () => {
    if (quantidade > 3) setQuantidade(prev => prev - 3);
  };

  const confirmarImpressao = () => {
    onConfirm({ codigo, quantidade });
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
