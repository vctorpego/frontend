import React from 'react';
import { CupSoda } from 'lucide-react';
import * as S from './styles';

const Logo = ({ expanded }) => {
  return (
    <S.LogoContainer>
      <CupSoda size={32} color="#1e3a8a" />
      {expanded && <S.LogoText>TechMeal</S.LogoText>}
    </S.LogoContainer>
  );
};

export default Logo;