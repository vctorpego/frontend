import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  width: 280px;

  .icon {
    color: #007bff;
    margin-bottom: 10px;
  }
`;

export const Message = styled.div`
  margin: 15px 0;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
  }

  p {
    font-size: 14px;
    color: #555;
  }
`;

export const Counter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;

  button {
    width: 32px;
    height: 32px;
    font-size: 20px;
    border: none;
    background-color: #ddd;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background-color: #ccc;
    }
  }

  span {
    font-size: 18px;
    font-weight: bold;
    width: 30px;
    display: inline-block;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 10px;

  .print {
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;

    &:hover {
      background-color: #0069d9;
    }
  }

  .cancel {
    padding: 8px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
