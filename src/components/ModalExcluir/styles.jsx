import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  width: 250px;

  .icon {
    color: #dc3545;
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

export const Buttons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;

  .delete {
    padding: 8px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;

    &:hover {
      background-color: #c82333;
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
