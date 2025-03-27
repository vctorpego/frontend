import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

export const LogoText = styled.h1`
  color: #3498db;
  font-size: 24px;
  margin-left: 10px;
`;

export const Menu = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const MenuItem = styled.div.attrs((props) => ({
  // Filtra a prop `isActive` para não ser passada para o DOM
  'data-active': props.isActive ? 'true' : 'false',
}))`
  display: flex;
  align-items: center;
  padding: 15px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? "#34495e" : "transparent")}; /* Cor ativa */

  &:hover {
    background-color: #34495e; /* Cor do hover */
  }

  svg {
    margin-right: 10px;
  }
`;

export const UserInfo = styled.div`
  margin-top: auto;
  padding: 20px;
  text-align: center;
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
