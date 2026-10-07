import { Link } from 'react-router';
import styled from 'styled-components';

export const PaginaJogadores = styled.main`
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 110px;
`;

export const TituloJogadores = styled.h1`
  margin: 0;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: clamp(26px, 3.3vw, 36px);
  font-weight: 700;
`;

export const EstadoVazioJogadores = styled.div`
  padding: 18px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
  color: #8d8980;
  font-size: 13px;
  line-height: 1.5;

  min-height: 76px;
  display: flex;
  align-items: center;

  > p {
    margin: 0;
  }
`;

export const BotaoCadastroJogador = styled(Link)`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-radius: 10px;
  background: #355345;
  color: #fff;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: #294235;
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 3px;
  }
`;

export const ListaJogadores = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 24px;
`;

export const CartaoJogador = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  > div:first-child h2 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 16px;
  }

  > div:first-child p {
    margin: 6px 0 0;
    color: #8d8980;
    font-size: 12px;
  }

  > div:last-child {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  > div:last-child span {
    padding: 6px 9px;
    border-radius: 999px;
    background: #e8efe5;
    color: #355345;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  strong {
    color: #355345;
    font-family: Manrope, sans-serif;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;

    > div:last-child {
      width: 100%;
      justify-content: space-between;
      gap: 8px;
    }
  }
`;

export const CabecalhoJogadores = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  > h1 {
    margin: 0;
  }

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const MensagemEstadoJogadores = styled.p`
  margin: 24px 0 0;
  padding: 16px 18px;
  border: 1px solid #e8e4dc;
  border-radius: 12px;
  background: #fff;
  color: #8d8980;
  font-size: 13px;
`;

export const MensagemErroJogadores = styled(MensagemEstadoJogadores)`
  border-color: #f0d0cc;
  background: #fff8f7;
  color: #b42318;
`;

export const BotaoExcluirJogador = styled.button`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #e8e4dc;
  background: #fff;
  color: #8d8980;

  &:hover:not(:disabled) {
    border-color: #f0d0cc;
    background: #fff8f7;
    color: #b42318;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid #b42318;
    outline-offset: 3px;
  }
`;

export const BotaoEditarJogador = styled(Link)`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid #e8efe5;
  border-radius: 10px;
  background: #fff;
  color: #355345;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: #e8efe5;
  }

  &:focus-visible {
    outline: 2px solid #355345;
    outline-offset: 3px;
  }
`;

export const EyebrowJogadores = styled.p`
  margin: 0 0 8px;
  color: #a07842;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
`;

export const DescricaoJogadores = styled.p`
  margin: 8px 0 0;
  color: #8d8980;
  font-size: 13px;
  line-height: 1.5;
`;

export const ContagemJogadores = styled.p`
  display: inline-flex;
  margin: 14px 0 0;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8efe5;
  color: #355345;
  font-size: 11px;
  font-weight: 600;
`;
