import styled from 'styled-components';

export const ListaHistorico = styled.section`
  display: grid;
  gap: 12px;
  margin-top: 24px;
`;

export const CartaoHistorico = styled.article`
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
`;

export const CabecalhoHistorico = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const DataHistorico = styled.time`
  color: #8d8980;
  font-size: 12px;
  text-transform: capitalize;
`;

export const StatusHistorico = styled.span`
  flex: 0 0 auto;
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === 'finished'
      ? '#e8efe5'
      : $status === 'in_progress'
        ? '#fff3dc'
        : '#f1f0ec'};
  color: ${({ $status }) =>
    $status === 'finished'
      ? '#355345'
      : $status === 'in_progress'
        ? '#88651e'
        : '#77736b'};
  font-size: 11px;
  font-weight: 700;
`;

export const ConfrontoHistorico = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: 16px;
  font-weight: 700;

  span:first-child {
    color: #355345;
    overflow-wrap: anywhere;
  }

  span:nth-child(2) {
    color: #a07842;
    font-size: 13px;
  }

  span:last-child {
    color: #a07842;
    text-align: right;
    overflow-wrap: anywhere;
  }
`;

export const DetalhesHistorico = styled.p`
  margin: -6px 0 0;
  color: #8d8980;
  font-size: 12px;
`;

export const ResultadoHistorico = styled.p`
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid #f0ede7;
  color: #8d8980;
  font-size: 12px;

  strong {
    color: #355345;
  }
`;

export const EstadoHistorico = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 18px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
  color: #8d8980;
  font-size: 13px;
  line-height: 1.5;

  strong {
    color: #302e28;
    font-family: Manrope, sans-serif;
    font-size: 15px;
  }
`;

export const ErroHistorico = styled(EstadoHistorico)`
  border-color: #f0d0cc;
  background: #fff8f7;
  color: #b42318;
`;
