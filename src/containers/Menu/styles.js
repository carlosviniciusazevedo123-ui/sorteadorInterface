import { Link } from 'react-router';
import styled from 'styled-components';

export const Cabecalho = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
`;

export const PerfilUsuario = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const AvatarUsuario = styled.div`
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 12px;
  background: #355345;
  color: #fff;
  font-family: Manrope, sans-serif;
  font-size: 14px;
  font-weight: 700;
`;

export const Apresentacao = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
  text-align: left;
`;

export const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: #a07842;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

export const Titulo = styled.h1`
  margin: 0 0 8px;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: clamp(26px, 3.3vw, 36px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -1.2px;
`;

export const Destaque = styled.span`
  color: #e87b52;
`;

export const Subtitulo = styled.p`
  max-width: 42ch;
  margin: 0;
  color: #8d8980;
  font-size: 13px;
  line-height: 1.5;
`;
export const InformacoesUsuario = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

export const Saudacao = styled.p`
  margin: 0;
  color: #8d8980;
  font-size: 12px;
  line-height: 1.2;
`;

export const NomePainel = styled.strong`
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
`;

export const BotaoSair = styled.button`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #355345;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s,
    border-color 0.18s;

  &:hover {
    border-color: #355345;
    background: #f9f8f5;
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 3px;
  }
`;

export const CartaoResumo = styled.section`
  display: flex;
  min-height: 138px;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(48, 46, 40, 0.04);
`;

export const ValorResumo = styled.strong`
  display: block;
  color: #355345;
  font-family: Manrope, sans-serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
`;

export const TituloResumo = styled.h2`
  margin: 0 0 6px;
  color: #8d8980;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
`;

export const CartaoPartida = styled(CartaoResumo)`
  border-color: #355345;
  background: #355345;

  h2 {
    color: rgba(255, 255, 255, 0.75);
  }

  strong {
    color: #fff;
  }
`;

export const CartaoSorteioVazio = styled.div`
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
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Pagina = styled.main`
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 110px;
`;

export const ResumoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const AcaoLink = styled(Link)`
  display: flex;
  min-height: 72px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e8e4dc;
  border-radius: 12px;
  background: #fff;
  color: #355345;
  font-weight: 600;
  text-decoration: none;
  gap: 12px;

  &:hover {
    border-color: #355345;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(53, 83, 69, 0.1);
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 3px;
  }

  @media (max-width: 520px) {
    padding: 12px;
    gap: 8px;
  }
`;

export const IconeAcao = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 10px;
  background: #e8efe5;
  color: #355345;

  @media (max-width: 520px) {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
  }
`;

export const AcaoPrincipal = styled(AcaoLink)`
  border-color: #355345;
  background: #355345;
  color: #fff;

  > span {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  div > span {
    background: transparent;
    color: rgba(255, 255, 255, 0.75);
  }
`;

export const SecaoAcoes = styled.section`
  margin-top: 32px;
`;

export const TituloSecao = styled.h2`
  font-family: Manrope, sans-serif;
  color: #302e28;
  font-size: 20px;
  margin: 0 0 16px;
`;

export const AcoesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const SecaoUltimoSorteio = styled.section`
  margin-top: 28px;
`;

export const TextoAcao = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TituloAcao = styled.strong`
  font-size: 13px;
  line-height: 1.2;
`;

export const DescricaoAcao = styled.span`
  color: #8d8980;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.3;
`;

export const AcaoVazia = styled(Link)`
  color: #355345;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #355345;
    outline-offset: 3px;
  }
`;
