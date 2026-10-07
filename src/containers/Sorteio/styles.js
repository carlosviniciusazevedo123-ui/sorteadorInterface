import styled from 'styled-components';

export const SecaoSelecao = styled.section`
  margin-top: 28px;
`;

export const TituloSelecao = styled.h2`
  margin: 0 0 14px;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: 18px;
`;

export const ListaOpcoes = styled.div`
  display: grid;
  gap: 10px;
`;

export const OpcaoJogador = styled.label`
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid
    ${({ $selecionado }) => ($selecionado ? '#355345' : '#e8e4dc')};
  border-radius: 12px;
  background: ${({ $selecionado }) => ($selecionado ? '#f5f8f3' : '#fff')};
  cursor: pointer;

  > input {
    display: grid;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    place-items: center;
    appearance: none;
    border: 2px solid #d5d9d2;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;

    &:checked {
      border-color: #355345;
      background: #355345;
    }

    &:checked::after {
      content: '✓';
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
    }

    &:focus-visible {
      outline: 3px solid rgba(53, 83, 69, 0.2);
      outline-offset: 2px;
    }
  }

  > div {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    overflow: hidden;
    color: #302e28;
    font-size: 14px;
    text-overflow: ellipsis;
  }

  span {
    color: #8d8980;
    font-size: 12px;
  }

  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: #aebcaf;
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const CampoBusca = styled.input`
  width: 100%;
  min-height: 46px;
  margin-bottom: 12px;
  padding: 0 14px;
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

export const GradeConfiguracoes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
`;

export const CampoConfiguracao = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #302e28;
  font-size: 13px;
  font-weight: 600;
`;

export const InputConfiguracao = styled.input`
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

export const OpcaoConfiguracao = styled.label`
  display: flex;
  min-height: 50px;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 0 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  background: #f5f8f3;
  color: #302e28;
  font-size: 14px;

  input {
    width: 18px;
    height: 18px;
    accent-color: #355345;
  }
`;

export const ListaTimesSorteados = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`;

export const CartaoTimeSorteado = styled.article`
  padding: 16px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(48, 46, 40, 0.04);
`;

export const TituloTimeSorteado = styled.h3`
  margin: 0;
  color: #355345;
  font-family: Manrope, sans-serif;
  font-size: 16px;
`;

export const ListaJogadoresSorteados = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const JogadorSorteado = styled.li`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0ede7;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const BotaoAcaoSorteio = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: 14px;
  border: 0;
  border-radius: 10px;
  background: #355345;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 2px;
  }

  transition:
    background-color 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    background: #294437;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;

export const CartaoConfiguracaoSorteio = styled.section`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
`;

export const LinhaQuantidadeTimes = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TextoQuantidadeTimes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #302e28;
    font-size: 14px;
  }

  span {
    color: #8d8980;
    font-size: 12px;
  }
`;

export const ControleQuantidadeTimes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BotaoAjusteQuantidade = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #f0f3ed;
  color: #355345;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;

  transition:
    background-color 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    background: #e5ebe2;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const ValorQuantidadeTimes = styled.strong`
  min-width: 20px;
  color: #355345;
  text-align: center;
  font-size: 16px;
`;

export const NotaJogadorSorteio = styled.span`
  flex: 0 0 auto;
  padding: 5px 8px;
  border: 1px solid #ead8a7;
  border-radius: 8px;
  background: #fff8e8;
  color: #88651e;
  font-size: 12px;
  font-weight: 700;
`;

export const CabecalhoJogadoresSorteio = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 24px 0 12px;
`;

export const TituloDisponiveisSorteio = styled.h2`
  margin: 0;
  color: #302e28;
  font-family: Manrope, sans-serif;
  font-size: 18px;
`;

export const ContadorSelecionadosSorteio = styled.span`
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e9efe7;
  color: #355345;
  font-size: 12px;
  font-weight: 700;
`;

export const ResumoConfiguracaoSorteio = styled.p`
  margin: 0;
  padding: 12px;
  border: 1px solid #e1e8de;
  border-radius: 10px;
  background: #f5f8f3;
  color: #56645a;
  font-size: 12px;
  line-height: 1.5;
`;

export const CabecalhoTimeSorteado = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0ede7;
`;

export const MediaTimeSorteado = styled.span`
  flex: 0 0 auto;
  padding: 5px 8px;
  border: 1px solid #ead8a7;
  border-radius: 8px;
  background: #fff8e8;
  color: #88651e;
  font-size: 12px;
  font-weight: 700;
`;

export const NumeroJogadorSorteado = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  border-radius: 50%;
  background: #f0f3ed;
  color: #355345;
  font-size: 12px;
  font-weight: 700;
`;

export const InfoJogadorSorteado = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 3px;

  strong {
    overflow: hidden;
    color: #302e28;
    font-size: 13px;
    text-overflow: ellipsis;
  }

  span {
    color: #8d8980;
    font-size: 11px;
  }
`;

export const TipoJogadorSorteado = styled.span`
  flex: 0 0 auto;
  padding: 4px 7px;
  border-radius: 6px;
  background: ${({ $reserva }) => ($reserva ? '#fff3dc' : '#e9efe7')};
  color: ${({ $reserva }) => ($reserva ? '#88651e' : '#355345')};
  font-size: 10px;
  font-weight: 700;
`;

export const AcoesResultadoSorteio = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;

  ${BotaoAcaoSorteio} {
    margin-top: 0;
  }
`;

export const BotaoSecundarioSorteio = styled.button`
  width: 100%;
  min-height: 48px;
  border: 1px solid #355345;
  border-radius: 10px;
  background: #fff;
  color: #355345;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f5f8f3;
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 2px;
  }
`;
