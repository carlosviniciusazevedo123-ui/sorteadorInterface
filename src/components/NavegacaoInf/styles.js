import styled from 'styled-components';

export const Button = styled.button`
  border: 0;
  background: transparent;
  color: #8d8980;
  font: inherit;
  cursor: pointer;

  display: flex;
  min-height: 48px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;

  &[aria-current='page'] {
    color: #355345;
    font-weight: 700;
  }
`;
export const Navegacao = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  display: grid;
  grid-template-columns: repeat(
    ${({ $comJogo }) => ($comJogo ? 6 : 5)},
    minmax(0, 1fr)
  );
  gap: 4px;

  padding: 8px 8px max(8px, env(safe-area-inset-bottom));
  border-top: 1px solid #ece9e1;
  background: #fff;
`;
