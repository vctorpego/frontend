import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const Sidebar = styled.div`
  width: 10%;  // A sidebar vai ocupar 10% da largura da tela
  background-color: #f4f4f4;
  padding: 20px;
`;

export const Content = styled.div`
  width: 90%;  // O conteúdo vai ocupar os 90% restantes
  padding: 20px;
  background-color: #fff;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: #333;
`;

export const TableContainer = styled.div`
  margin-top: 20px;
`;

export const Grid = styled.div`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

export const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 10px;
  font-weight: bold;
  text-align: left;
  color: #333;
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

export const ButtonDelete = styled.button`
  background-color: #e74c3c;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    background-color: #c0392b;
  }
`;

export const ButtonEdit = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    background-color: #2980b9;
  }
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ open }) => (open ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
`;

export const ModalButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
  &:hover {
    background-color: transparent;
  }
`;
