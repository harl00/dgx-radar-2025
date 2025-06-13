import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 10px 0 0;
  font-size: 16px;
  opacity: 0.9;
  max-width: 800px;
`;

const Header = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeaderContainer>
  );
};

export default Header;
