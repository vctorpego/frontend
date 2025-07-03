import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const Left = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 700px;
  }
`;

export const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

export const FormBox = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  text-align: center;

  h2 {
    font-size: 32px;
    margin-bottom: 28px;
  }

  p {
    margin-top: 18px;
    font-size: 16px;
    color: #676767;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;

    label {
      text-align: left;
      font-size: 18px;
      color: #333;
      margin-top: 12px;
    }
  }
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 16px 16px;
  font-size: 16px;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  background-color: #f5f5f5;
  outline: none;
  transition: border 0.3s, background-color 0.3s;

  &:focus {
    border-color: #00aaff;
    background-color: #fff;
  }

  &::placeholder {
    color: #aaa;
    font-size: 16px;
  }
`;

export const labelError = styled.label`
  font-size: 16px;
  color: red;
`;