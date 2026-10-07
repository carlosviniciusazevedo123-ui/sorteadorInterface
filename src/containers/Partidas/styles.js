import styled from 'styled-components';

export const CartaoCriacaoPartida = styled.article`
  display: grid;
  gap: 12px;
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  h2 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: #8d8980;
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const BotaoCriarPartida = styled.button`
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

export const ResumoPartida = styled.section`
  display: grid;
  gap: 16px;
  margin-top: 28px;
`;

export const CartaoTimePartida = styled.article`
  padding: 16px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  h3 {
    margin: 0 0 12px;
    color: #355345;
    font-family: Manrope, sans-serif;
    font-size: 16px;
  }
`;

export const ListaJogadoresPartida = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ItemJogadorPartida = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0ede7;
  color: #302e28;
  font-size: 13px;
  line-height: 1.5;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const EtiquetaTipoJogadorPartida = styled.span`
  flex: 0 0 auto;
  padding: 4px 7px;
  border-radius: 6px;
  background: ${({ $reserva }) => ($reserva ? '#fff3dc' : '#e9efe7')};
  color: ${({ $reserva }) => ($reserva ? '#88651e' : '#355345')};
  font-size: 10px;
  font-weight: 700;
`;

export const MensagemEstadoPartida = styled.p`
  margin: 24px 0 0;
  padding: 16px 18px;
  border: 1px solid #e8e4dc;
  border-radius: 12px;
  background: #fff;
  color: #8d8980;
  font-size: 13px;
  line-height: 1.5;
`;

export const MensagemErroPartida = styled(MensagemEstadoPartida)`
  border-color: #f0d0cc;
  background: #fff8f7;
  color: #b42318;
`;

export const CabecalhoPartida = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 20px;
  }

  p {
    margin: 6px 0 0;
    color: #8d8980;
    font-size: 13px;
  }
`;

export const StatusPartida = styled.span`
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8efe5;
  color: #355345;
  font-size: 12px;
  font-weight: 700;
`;

export const ListaTimesPartida = styled.div`
  display: grid;
  gap: 12px;
`;

export const ConfiguracaoJogo = styled.section`
  display: grid;
  gap: 16px;
  margin-top: 8px;
  padding: 18px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;

  h3 {
    margin: 0;
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 17px;
  }
`;

export const CampoConfiguracaoJogo = styled.label`
  display: grid;
  gap: 7px;
  color: #302e28;
  font-size: 13px;
  font-weight: 600;
`;

export const SelecaoConfiguracaoJogo = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #302e28;
  font: inherit;

  &:focus-visible {
    border-color: #355345;
    outline: none;
    box-shadow: 0 0 0 3px rgba(53, 83, 69, 0.15);
  }
`;

export const EntradaDuracaoJogo = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #fff;
  color: #302e28;
  font: inherit;

  &:focus-visible {
    border-color: #355345;
    outline: none;
    box-shadow: 0 0 0 3px rgba(53, 83, 69, 0.15);
  }
`;
