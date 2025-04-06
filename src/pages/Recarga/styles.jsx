import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    min-height: 100vh;
    flex-direction: row;
    background-color: #f4f4f4;
`;

export const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 20px;
`;

export const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

export const Form = styled.form`
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    label {
        font-size: 16px;
        margin-bottom: 5px;
    }

    input {
        padding: 10px;
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
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #0056b3;
        }
    }

    div {
        margin-top: 10px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 4px;
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
