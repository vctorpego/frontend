import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ open }) => (open ? "rgba(0,0,0,0.2)" : "transparent")};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  transition: background-color 0.3s;
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
  transition: transform 0.3s, opacity 0.3s;
  transform: ${({ open }) => (open ? "scale(1)" : "scale(1.25)")};
  opacity: ${({ open }) => (open ? 1 : 0)};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  color: gray;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f4f4f4;
    color: #333;
  }
`;
