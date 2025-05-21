import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: row;
  background: linear-gradient(135deg, #e9f0ff 0%, #f4f8ff 100%);
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  color: #222f3e;
  text-align: center;
  margin-bottom: 0.3em;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Description = styled.p`
  font-size: 1.1rem;
  color: #555b6e;
  text-align: center;
  margin-bottom: 1.5em;
  line-height: 1.5;
  font-weight: 400;
  font-family: 'Open Sans', Arial, sans-serif;
`;

export const Mensagem = styled.div`
  color: #856404;
  background-color: #fff9db;
  border: 1.5px solid #ffecb5;
  padding: 16px 24px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(245, 195, 66, 0.3);
  animation: fadeIn 0.35s ease-in-out;
  font-family: 'Open Sans', Arial, sans-serif;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Form = styled.form`
  background-color: #fafafa;
  padding: 35px 30px;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  font-family: 'Open Sans', Arial, sans-serif;
`;

export const Input = styled.input`
  padding: 14px 16px;
  font-size: 17px;
  border: 2px solid #d1d8e0;
  border-radius: 8px;
  width: 100%;
  transition: all 0.3s ease;
  font-family: 'Open Sans', Arial, sans-serif;

  &:focus {
    border-color: #1e90ff;
    outline: none;
    background-color: #f0f7ff;
    box-shadow: 0 0 8px rgba(30, 144, 255, 0.3);
    transform: scale(1.04);
  }
`;

export const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 550px;
  margin-top: 1rem;
  font-family: 'Open Sans', Arial, sans-serif;
`;

export const ProductItem = styled.li`
  background-color: #fff;
  padding: 18px 22px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  cursor: default;
  transition: background-color 0.25s ease;
  font-family: 'Open Sans', Arial, sans-serif;

  &:hover {
    background-color: #f9fbff;
  }
`;

export const ProductPrice = styled.span`
  font-weight: 600;
  color: #2ecc71;
  font-size: 1.15rem;
  min-width: 70px;
  text-align: right;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #606f7b;
  font-weight: 500;
  font-family: 'Open Sans', Arial, sans-serif;
`;

export const Button = styled.button`
  background-color: #1e90ff;
  color: white;
  padding: 14px 26px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.35s ease;
  width: 100%;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background-color: #0b70d0;
    transform: scale(1.07);
    box-shadow: 0 6px 14px rgba(11, 112, 208, 0.45);
  }

  &:not(:only-child) {
    width: auto;
    max-width: 280px;
    margin-top: 24px;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  gap: 14px;
  flex-direction: column;
  width: 100%;
  max-width: 550px;
  font-family: 'Open Sans', Arial, sans-serif;

  @media (min-width: 500px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const ClienteNome = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  color: #34495e;
  margin-top: 14px;
  margin-bottom: 0;
  letter-spacing: 0.015em;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const ValorTotal = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  color: #34495e;
  margin-top: 6px;
  margin-bottom: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const SubTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #57606a;
  margin-top: 28px;
  margin-bottom: 10px;
  letter-spacing: 0.01em;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
