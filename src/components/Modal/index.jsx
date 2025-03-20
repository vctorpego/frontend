import React from "react";
import * as C from "./styles";
import { X } from "lucide-react";

const Modal = ({ open, onClose, children }) => {
  return (
    <C.Backdrop open={open} onClick={onClose}>
      <C.ModalContainer open={open} onClick={(e) => e.stopPropagation()}>
        <C.CloseButton onClick={onClose}>
          <X />
        </C.CloseButton>
        {children}
      </C.ModalContainer>
    </C.Backdrop>
  );
};

export default Modal;
