import styled from 'styled-components';

export const CartaoJogo = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;

  > .game-status {
    order: -1;
  }
  > .matchup {
    order: 0;
  }
  > .score {
    order: 1;
  }
  > .game-clock {
    order: 2;
  }
  > .quick-events {
    order: 3;
  }
  > .lineup {
    order: 4;
  }
  > .timeline {
    order: 5;
  }
`;

export const CabecalhoTimesJogo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  strong {
    font-family: Manrope, sans-serif;
    font-size: 15px;
  }

  .time-a {
    color: #355345;
  }

  .time-b {
    color: #a07842;
    text-align: right;
  }

  span {
    color: #8d8980;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const CartaoCronometroJogo = styled.section`
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 18px 16px 16px;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  background: #fff;
`;

export const ControlesCronometroJogo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;

  > button:only-child {
    grid-column: 1 / -1;
  }
`;

export const AbasJogo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: #e9ece6;
`;

export const AbaJogo = styled.button`
  min-height: 38px;
  border: 0;
  border-radius: 9px;
  background: ${({ $ativa }) => ($ativa ? '#fff' : 'transparent')};
  color: ${({ $ativa }) => ($ativa ? '#355345' : '#8d8980')};
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const ConfrontoJogo = styled.h2`
  margin: 0;
  color: #355345;
  font-family: Manrope, sans-serif;
  font-size: 20px;
  text-align: left;
`;

export const StatusJogo = styled.span`
  justify-self: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: #e8efe5;
  color: #355345;
  font-size: 12px;
  font-weight: 700;
`;

export const DetalhesJogo = styled.p`
  margin: 0;
  color: #8d8980;
  font-size: 13px;
  text-align: center;
`;

export const BotaoAcaoJogo = styled.button`
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

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 2px;
  }
`;

export const CronometroJogo = styled.p`
  margin: 0;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: clamp(38px, 12vw, 48px);
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const CampoVencedorJogo = styled.label`
  display: grid;
  gap: 7px;
  color: #302e28;
  font-size: 13px;
  font-weight: 600;
`;

export const SelectVencedorJogo = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #302e28;
  font: inherit;
`;

export const FundoModalResultado = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  align-items: end;
  background: rgba(30, 34, 30, 0.45);

  @media (min-width: 600px) {
    align-items: center;
    padding: 20px;
  }
`;

export const ModalResultado = styled.section`
  display: grid;
  gap: 16px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px 20px calc(24px + env(safe-area-inset-bottom));
  border: 1px solid #e8e4dc;
  border-radius: 20px 20px 0 0;
  background: #faf9f6;
  box-shadow: 0 -12px 40px rgba(48, 46, 40, 0.14);

  h2 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 22px;
    text-align: center;
  }

  p {
    margin: 0;
    color: #355345;
    font-weight: 700;
    text-align: center;
  }

  @media (min-width: 600px) {
    justify-self: center;
    max-width: 440px;
    border-radius: 20px;
  }
`;

export const LinkAvaliacaoJogo = styled.code`
  display: block;
  overflow-wrap: anywhere;
  padding: 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #355345;
  font-size: 12px;
  line-height: 1.5;
`;

export const ElencosJogo = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 8px;
`;

export const TimeElencoJogo = styled.section`
  padding: 14px;
  border: 1px solid #e8e4dc;
  border-radius: 12px;
  background: #faf9f6;

  h3 {
    margin: 0 0 10px;
    color: #355345;
    font-family: Manrope, sans-serif;
    font-size: 15px;
  }
`;

export const ItemElencoJogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid #e8e4dc;
  color: #302e28;
  font-size: 13px;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const NumeroElencoJogo = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #edf1eb;
  color: #355345;
  font-size: 12px;
  font-weight: 700;
`;

export const TipoElencoJogo = styled.span`
  margin-left: auto;
  padding: 4px 7px;
  border-radius: 6px;
  background: #e9efe7;
  color: #355345;
  font-size: 10px;
  font-weight: 700;
`;

export const PlacarJogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 4vw, 20px);
  padding: 18px 10px;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  background: #fff;
`;

export const ValorPlacarJogo = styled.strong`
  min-width: 32px;
  color: #355345;
  font-family: Manrope, sans-serif;
  font-size: clamp(42px, 14vw, 54px);
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const GrupoPlacarJogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const BotaoPlacarJogo = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: ${({ $menos }) => ($menos ? '#edf1eb' : '#355345')};
  color: ${({ $menos }) => ($menos ? '#8d8980' : '#fff')};
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const AcoesRapidasJogo = styled.section`
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  h3 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 16px;
  }
`;

export const GradeAcoesJogo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const BotaoEventoJogo = styled.button`
  min-height: 42px;
  border: 1px solid ${({ $perigo }) => ($perigo ? '#f0d0cc' : '#dce7d9')};
  border-radius: 9px;
  background: ${({ $perigo }) => ($perigo ? '#fff8f7' : '#f3f7f1')};
  color: ${({ $perigo }) => ($perigo ? '#b42318' : '#355345')};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const BotaoControleJogo = styled(BotaoEventoJogo)`
  min-height: 42px;
  border-color: ${({ $finalizar }) => ($finalizar ? '#f0d0cc' : '#dce7d9')};
  background: ${({ $finalizar, $primario }) =>
    $finalizar ? '#fff3f1' : $primario ? '#355345' : '#edf1eb'};
  color: ${({ $finalizar, $primario }) =>
    $finalizar ? '#b42318' : $primario ? '#fff' : '#355345'};
`;

export const ListaEventosJogo = styled.div`
  display: grid;
  gap: 8px;
`;

export const ItemEventoJogo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0ede7;
  color: #5e5a52;
  font-size: 12px;

  &:last-child {
    border-bottom: 0;
  }
`;

export const FundoModalEvento = styled(FundoModalResultado)`
  z-index: 30;
`;

export const ModalEvento = styled(ModalResultado)`
  h2 {
    text-align: left;
  }
`;

export const CampoEventoJogo = styled.label`
  display: grid;
  gap: 7px;
  color: #302e28;
  font-size: 13px;
  font-weight: 600;

  select {
    width: 100%;
    min-height: 46px;
    padding: 0 12px;
    border: 1px solid #e8e4dc;
    border-radius: 10px;
    background: #fff;
    color: #302e28;
    font: inherit;
  }
`;
