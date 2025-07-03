import styled from "styled-components";

export const Container = styled.div`
  width: calc(100% - 200px);
  margin-left: 200px;
  min-height: 100vh;
  padding: 40px;
  background-color: #f4f4f4;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const BackButton = styled.button`
  position: fixed;
  top: 30px;
  left: 220px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    position: static;
    margin-bottom: 20px;
    left: auto;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 900px) {
    padding: 25px 20px;
  }
`;

export const InputsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
  }
`;

export const AdminCheckbox = styled.div`
  margin-top: 5px;

  label {
    font-weight: 600;
    color: #007bff;
    cursor: pointer;
    user-select: none;

    input {
      margin-right: 8px;
      transform: scale(1.2);
      cursor: pointer;
    }
  }
`;

export const PermissionsSection = styled.section`
  display: flex;
  flex-direction: column;

  h3 {
    font-weight: 700;
    margin-bottom: 20px;
    color: #222;
    font-size: 1.6rem;
  }
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #fafafa;
  padding: 20px 18px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }
`;

export const CardTitle = styled.h4`
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.15rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

export const PermissionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const PermissionItem = styled.li`
  margin-bottom: 10px;

  label {
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    color: #555;
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      transform: scale(1.2);
      cursor: pointer;
    }
  }
`;

export const AddButtonWrapper = styled.div`
  width: 180px;
  align-self: center;

  button {
    width: 100%;
    font-size: 1rem;
    padding: 14px;
  }

  @media (max-width: 768px) {
    width: 160px;
  }
`;

export const Message = styled.div`
  align-self: center;
  width: fit-content;
  max-width: 80%;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ type }) =>
    type === "success" ? "#d4edda" : "#f8d7da"};
  color: ${({ type }) => (type === "success" ? "#155724" : "#721c24")};
`;
