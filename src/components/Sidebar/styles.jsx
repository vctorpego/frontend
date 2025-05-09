import styled from "styled-components";

// Sidebar fixa, sem scroll geral
export const SidebarContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: #007bff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px 0;
  position: fixed;
`;

// Container principal da página
export const Container = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

// Logo fixa no topo
export const Logo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 15px;
  margin-bottom: 40px; /* Espaçamento padrão grande */

  svg {
    color: white;
  }

  @media (max-height: 600px) {
    margin-bottom: 15px; /* Reduz o espaço em telas menores */
  }
`;

export const LogoText = styled.h1`
  color: #f0f0f0;
  font-size: 20px;
  margin-left: 4px;
  margin-top: 6px;
  white-space: nowrap;
`;

// Menu com scroll independente
export const Menu = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 5px; /* opcional: para não colar o scroll no texto */
  display: flex;
  flex-direction: column;
  gap: 4px;

  /* Scroll invisível */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

// Itens do menu com tamanho reduzido
export const MenuItem = styled.div.attrs((props) => ({
  'data-active': props.isActive ? 'true' : 'false',
}))`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? "#0056b3" : "transparent")};

  &:hover {
    background-color: #0069d9;
  }

  svg {
    margin-right: 8px;
    font-size: 16px;
  }
`;

// Informações do usuário fixas embaixo
export const UserInfo = styled.div`
  padding: 16px;
  text-align: left;
  color: white;
  font-size: 12px;
  flex-shrink: 0;
`;

export const UserName = styled.h3`
  font-size: 14px;
  margin: 4px 0;
`;

export const UserEmail = styled.p`
  font-size: 12px;
  margin: 0;
  opacity: 0.7;
`;
