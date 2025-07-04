import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 200px);
  margin-left: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
`;

export const Form = styled.form`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
    }

    label {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input {
        padding: 10px;
        margin-top: 5px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
    }

    button {
        padding: 12px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        margin-top: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #0056b3;
        }
    }

    div {
        margin-top: 5px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 4px;
    }

    div p {
        margin-bottom: 5px;
    }

`;

export const Sucesso = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #c3e6cb;
  font-weight: bold;
  animation: fadeInOut 3s ease-in-out forwards;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-10px); }
  }
`;