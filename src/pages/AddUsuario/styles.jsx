import styled from "styled-components";

// Container principal da página
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px 20px 280px; /* compensa a sidebar fixa */
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

// Título centralizado acima do formulário
export const Title = styled.h2`
  font-size: 32px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

// Formulário com largura maior e responsividade
export const Form = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1100px;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 30px 20px;
  }
`;

// Agrupamento de campos em linha
export const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

// Wrapper para campo individual
export const InputWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

// Estilo do label
export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

// Estilo dos inputs
export const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
`;

// Botão principal
export const Button = styled.button`
  grid-column: span 2;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Container de checkboxes com grid 2 colunas
export const CheckboxContainer = styled.div`
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Adiciona 4 colunas */
  gap: 10px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;

  strong {
    grid-column: span 4; /* Faz o título ocupar toda a linha */
    margin-bottom: 5px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Para telas menores, 1 coluna */
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
`;

export const Checkbox = styled.input`
  transform: scale(1.2);
  cursor: pointer;
`;

// Estilização para os cards de telas
export const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  margin-top: 20px;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 23%;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
`;

export const PermissionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const PermissionItem = styled.li`
  font-size: 14px;
  color: #555;
  padding: 5px 0;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
`;

export const CardCheckbox = styled.input`
  transform: scale(1.2);
`;
