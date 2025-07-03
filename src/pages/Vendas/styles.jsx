import styled from "styled-components";

export const Container = styled.div`
  width: calc(100% - 200px);
  margin-left: 200px;
  min-height: 100vh;
  background-color: #f4f4f4;
  padding: 40px 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const Card = styled.section`
  background: #fff;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 34px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1);
  }
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.015em;
`;

export const SubTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #57606a;
  text-align: center;
  margin: 12px 0 6px 0;
`;

export const Mensagem = styled.div`
  background-color: #fff9db;
  color: #856404;
  border: 1.5px solid #ffecb5;
  padding: 14px 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(245, 195, 66, 0.3);
`;

export const InfoGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
  gap: 12px;

  @media (max-width: 450px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const InfoItem = styled.div`
  font-size: 1.2rem;
  margin-top: 12px;
  color: #34495e;

  span {
    font-weight: 500;
    margin-right: 3px;
  }

  strong {
    font-weight: 600;
    color: #2c3e50;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  width: 100%;
  max-width: 550px;

  @media (min-width: 500px) {
    flex-direction: row;
    align-items: center;

    input {
      flex: 1;
    }

    button {
      flex: 0;
      width: auto;
      padding: 12px 18px;
      white-space: nowrap;
    }
  }
`;

export const Input = styled.input`
  padding: 12px 14px;
  font-size: 1rem;
  border: 2px solid #d1d8e0;
  border-radius: 8px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1e90ff;
    background-color: #f0f7ff;
    box-shadow: 0 0 8px rgba(30, 144, 255, 0.3);
    outline: none;
    transform: scale(1.02);
  }
`;

export const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 6px;
`;

export const ProductItem = styled.li`
  background: #fafafa;
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ProductPrice = styled.span`
  font-weight: 600;
  color: #c82333;
  font-size: 1.05rem;
`;

export const AddRefeicaoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    width: 100%;
    max-width: 220px;
  }
`;

export const Button = styled.button`
  background-color: #1e90ff;
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #0b70d0;
    transform: scale(1.04);
    box-shadow: 0 6px 14px rgba(11, 112, 208, 0.3);
  }
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #555b6e;
  text-align: center;
  margin-top: 8px;
`;
