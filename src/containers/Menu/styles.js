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
  padding: clamp(18px, 4vw, 32px);
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

export const SecaoUltimoJogo = styled.section`
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

export const NotaResumo = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  line-height: 1.4;
`;
export const InformacoesJogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  min-width: 0;
`;
export const StatusJogo = styled.span`
  border-radius: 20px;
  padding: 4px 10px;
  background: #e8efe5;
  color: #355345;
  font-size: 11px;
  font-weight: 700;
`;
export const ConfrontoJogo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  width: 100%;
  text-align: center;
  color: #302e28;
  font-family: Manrope, sans-serif;
  > strong {
    overflow-wrap: anywhere;
    font-size: clamp(16px, 2.5vw, 22px);
  }
  .time-a {
    color: #355345;
  }
  .time-b {
    color: #a07842;
  }
  @media (max-width: 520px) {
    gap: 8px;
    font-size: 12px;
  }
`;
export const PlacarJogo = styled.span`
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  color: #355345;
  font-size: clamp(20px, 4vw, 36px);
  font-weight: 700;
  white-space: nowrap;
`;

export const ElencosUltimoJogo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

export const TimeUltimoJogo = styled.section`
  min-width: 0;
  padding: 20px;
  border: 1px solid #e8e4dc;
  border-top: 3px solid ${({ $segundo }) => ($segundo ? '#a07842' : '#355345')};
  border-radius: 12px;
  background: #faf9f6;

  h3 {
    margin: 0 0 16px;
    color: ${({ $segundo }) => ($segundo ? '#a07842' : '#355345')};
    font-family: Manrope, sans-serif;
    font-size: 16px;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
  }

  @media (max-width: 520px) {
    padding: 12px 10px;
    h3 {
      font-size: 13px;
    }
  }
`;

export const CabecalhoUltimoJogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  time {
    font-size: 12px;
  }
`;

export const ListaJogadoresTime = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e8e4dc;
    color: #302e28;
  }

  li:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
  strong {
    min-width: 0;
    overflow-wrap: anywhere;
    font-weight: 600;
  }
  span {
    color: #8d8980;
    font-size: 11px;
  }
`;
