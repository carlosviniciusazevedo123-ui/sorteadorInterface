import { Link } from 'react-router';
import styled from 'styled-components';

export const CartaoFormularioJogador = styled.form`
  display: flex;
  max-width: 560px;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: 1px solid #e8e4dc;
  border-radius: 14px;
  background: #fff;
  margin-top: 20px;
`;

export const CampoJogador = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LabelJogador = styled.label`
  color: #302e28;
  font-size: 13px;
  font-weight: 600;
`;

export const InputJogador = styled.input`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #e8e4dc;
  border-radius: 10px;
  color: #302e28;
  font: inherit;

  transition:
    border-color 0.18s,
    box-shadow 0.18s;

  &:focus-visible {
    border-color: #355345;
    outline: none;
    box-shadow: 0 0 0 3px rgba(53, 83, 69, 0.15);
  }
`;

export const LinkVoltarJogadores = styled(Link)`
  display: inline-flex;
  margin-bottom: 16px;
  color: #355345;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const LinhaCheckbox = styled.label`
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid #e8efe5;
  border-radius: 10px;
  background: #f5f8f3;
  color: #302e28;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #355345;
  }
`;

export const CheckboxJogador = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #355345;
`;

export const ErroCadastroJogador = styled.p`
  margin: 0;
  color: #b42318;
  font-size: 13px;
`;

export const BotaoSalvarJogador = styled.button`
  min-height: 44px;
  border: 0;
  border-radius: 10px;
  background: #355345;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  transition: background 0.18s;

  &:hover:not(:disabled) {
    background: #294235;
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 83, 69, 0.25);
    outline-offset: 3px;
  }
`;
