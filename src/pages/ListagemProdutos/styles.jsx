import styled , {css} from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh; /* Garante que a página ocupe toda a altura da tela */
`;

export const Content = styled.div`
  margin-left: 250px; /* Sidebar tem 250px de largura */
  padding: 20px;
  width: 100%;
  overflow: auto;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

export const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin: 20px 0;
`;

export const TableHeader = styled.thead`
  background-color: #f4f4f4;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

export const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  font-size: 16px;
  color: #555;
`;

export const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const ButtonExcluir = styled.button`
  background-color: #f44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.open ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

export const ModalButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

export const ModalCloseButton = styled.button`
  background-color: #ccc;
  color: #fff;
  padding: 8px 16px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #bbb;
  }
`;
export const Message = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 5px;
  margin: 25px auto; /* <- centraliza horizontalmente */
  font-size: 16px;
  text-align: center;

  ${({ type }) => type === 'error' && css`
    background-color: #f8d7da;
    color: #842029;
    border: 1px solid #f5c2c7;
  `}

  ${({ type }) => type === 'success' && css`
    background-color: #d1e7dd;
    color: #0f5132;
    border: 1px solid #badbcc;
  `}

  ${({ type }) => type === 'info' && css`
    background-color: #cff4fc;
    color: #055160;
    border: 1px solid #b6effb;
  `}
`;

