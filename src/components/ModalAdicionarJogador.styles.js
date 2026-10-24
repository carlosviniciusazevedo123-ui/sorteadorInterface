import styled from 'styled-components';

export const FundoModalInclusao = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(24, 30, 26, 0.56);
`;
export const CaixaModalInclusao = styled.div`
  width: min(100%, 460px);
  max-height: min(90dvh, 640px);
  overflow-y: auto;
  padding: 22px;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
  color: #302e28;
  > label {
    display: block;
    margin: 18px 0 8px;
    font-size: 13px;
    font-weight: 700;
  }
`;
export const CabecalhoModalInclusao = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  h2 {
    margin: 0;
    color: #355345;
    font:
      700 20px Manrope,
      sans-serif;
  }
  p {
    margin: 6px 0 0;
    color: #77766f;
    font-size: 14px;
  }
`;
export const BotaoFecharModalInclusao = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: #f3f4f0;
  color: #355345;
  cursor: pointer;
  &:hover {
    background: #e7ece5;
  }
  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`;
export const CampoModalInclusao = styled.select`
  width: 100%;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid #deded6;
  border-radius: 10px;
  background: #fff;
  color: #302e28;
  font: inherit;
  &:focus-visible {
    outline: 3px solid #35534533;
    border-color: #355345;
  }
`;
export const MensagemModalInclusao = styled.p`
  margin: 12px 0 0;
  color: ${({ role }) => (role === 'alert' ? '#9c342c' : '#56645a')};
  font-size: 13px;
  line-height: 1.5;
`;
export const BotoesModalInclusao = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 22px;
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;
const BotaoModal = styled.button`
  min-height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.58;
  }
`;
export const BotaoModalSecundario = styled(BotaoModal)`
  border: 1px solid #355345;
  background: #fff;
  color: #355345;
  &:hover:not(:disabled) {
    background: #f5f8f3;
  }
`;
export const BotaoModalPrimario = styled(BotaoModal)`
  border: 0;
  background: #355345;
  color: #fff;
  &:hover:not(:disabled) {
    background: #294437;
  }
`;
