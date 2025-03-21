import styled from "styled-components";

export const Container = styled.div`
  width: 300px;
  text-align: left;
  padding: 20px;
`;

export const Message = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #555;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    display: block;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    color: #333;
    box-sizing: border-box;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 20px;

  .confirm {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #2980b9;
    }
  }

  .cancel {
    padding: 10px 20px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
