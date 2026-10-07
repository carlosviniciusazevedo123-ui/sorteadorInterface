import styled from 'styled-components';

export const PaginaAvaliacao = styled.main`
  min-height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  padding: 36px 20px 48px;

  > p:first-child {
    margin: 0 0 8px;
    color: #a07842;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.4px;
  }

  h1 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: clamp(26px, 6vw, 34px);
  }

  > span {
    display: block;
    margin-top: 8px;
    color: #8d8980;
    font-size: 13px;
  }
`;

export const CartaoAvaliacao = styled.section`
  display: grid;
  gap: 18px;
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  background: #fff;

  h2 {
    margin: 0;
    color: #355345;
    font-family: Manrope, sans-serif;
    font-size: 19px;
  }

  p {
    margin: -10px 0 0;
    color: #8d8980;
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const CampoNomeAvaliacao = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 0 13px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #302e28;
  font: inherit;

  &:focus-visible {
    border-color: #355345;
    outline: 3px solid rgba(53, 83, 69, 0.15);
  }
`;

export const ListaNotasAvaliacao = styled.div`
  display: grid;
  gap: 16px;
`;

export const LinhaNotaAvaliacao = styled.div`
  display: grid;
  gap: 8px;

  label {
    display: flex;
    justify-content: space-between;
    color: #302e28;
    font-size: 13px;
  }

  label strong {
    color: #355345;
    font-variant-numeric: tabular-nums;
  }

  input {
    width: 100%;
    accent-color: #355345;
  }
`;

export const BotaoEnviarAvaliacao = styled.button`
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 10px;
  background: #355345;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #294437;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

export const MensagemAvaliacao = styled.p`
  margin: 24px 0 0;
  padding: 16px;
  border: 1px solid ${({ $erro }) => ($erro ? '#f0d0cc' : '#dce7d9')};
  border-radius: 12px;
  background: ${({ $erro }) => ($erro ? '#fff8f7' : '#fff')};
  color: ${({ $erro }) => ($erro ? '#b42318' : '#355345')};
  font-size: 14px;
  line-height: 1.5;
`;
