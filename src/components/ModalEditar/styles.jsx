import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 100%;
`;

export const Message = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h3 {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    font-size: 16px;
    color: #555;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    outline: none;
  }

  .save {
    background-color: #28a745;
    color: white;
  }

  .cancel {
    background-color: #dc3545;
    color: white;
  }

  .delete {
    background-color: #f44336;
    color: white;
  }
  
  .cancel, .delete {
    background-color: #f44336;
  }
`;

export const InputContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  
  input {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 16px;
    margin-top: 10px;
    outline: none;
  }

  input:focus {
    border-color: #007bff;
  }
`;

export const Icon = styled.div`
  margin-bottom: 20px;
  text-align: center;

  .icon {
    color: #007bff;
  }
`;
