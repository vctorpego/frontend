import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #007bff; /* Cor de fundo da Sidebar */
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  padding-left: 15px;

  svg {
    color: white;
  }
`;

export const LogoText = styled.h1`
  color: #f0f0f0;
  font-size: 24px;
  margin-left: 4px;
  margin-top: 8px;
  white-space: nowrap; /* Evita quebra de linha no nome */
`;

export const Menu = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const MenuItem = styled.div.attrs((props) => ({
  'data-active': props.isActive ? 'true' : 'false',
}))`
  display: flex;
  align-items: center;
  padding: 13px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? "#0056b3" : "transparent")}; /* Tom mais escuro para ativo */

  &:hover {
    background-color: #0069d9; /* Azul mais escuro no hover */
  }

  svg {
    margin-right: 10px;
  }
`;

export const UserInfo = styled.div`
  margin-top: auto;
  padding: 20px;
  text-align: left;
  color: white;
  font-size: 14px;
`;

export const UserName = styled.h3`
  font-size: 18px;
  margin: 5px 0;
`;

export const UserEmail = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.7;
`;
