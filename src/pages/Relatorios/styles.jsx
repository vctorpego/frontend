import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: 100%;
  overflow: auto;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  span {
    display: block;
    margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #444;
  }
`;

/* ====== ESTILOS DOS MODAIS ====== */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalForm = styled.form`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
`;

export const ModalTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #007bff;
  font-weight: bold;
  font-size: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const ModalLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #444;
  font-weight: 600;
`;

export const ModalInput = styled.input`
  margin-left: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  flex: 1;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
`;

export const ModalCancelButton = styled.button`
  background-color: #f44336;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: #d32f2f;
  }
`;

export const ModalSubmitButton = styled.button`
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  color: white;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;
