import {
  CartaoFormularioJogador,
  CampoJogador,
  LabelJogador,
  InputJogador,
  LinhaCheckbox,
  CheckboxJogador,
  ErroCadastroJogador,
  BotaoSalvarJogador,
} from './styles';

export function FormularioJogador({
  nome,
  onNomeChange,
  posicao,
  onPosicaoChange,
  ehGoleiro,
  onEhGoleiroChange,
  nota,
  onNotaChange,
  exibirNota = false,
  erro,
  salvando,
  textoBotao,
  onSubmit,
}) {
  return (
    <CartaoFormularioJogador onSubmit={onSubmit}>
      <CampoJogador>
        <LabelJogador htmlFor="nome">Nome do jogador</LabelJogador>
        <InputJogador
          id="nome"
          name="name"
          type="text"
          value={nome}
          onChange={(event) => onNomeChange(event.target.value)}
          required
        />
      </CampoJogador>

      <CampoJogador>
        <LabelJogador htmlFor="posicao">Posição</LabelJogador>
        <InputJogador
          id="posicao"
          name="position"
          type="text"
          value={posicao}
          onChange={(event) => onPosicaoChange(event.target.value)}
          placeholder="Ex.: Ala"
        />
      </CampoJogador>

      <LinhaCheckbox>
        <CheckboxJogador
          type="checkbox"
          name="is_goalkeeper"
          checked={ehGoleiro}
          onChange={(event) => onEhGoleiroChange(event.target.checked)}
        />
        É goleiro
      </LinhaCheckbox>

      {exibirNota && (
        <CampoJogador>
          <LabelJogador htmlFor="nota">Avaliação geral (0 a 10)</LabelJogador>
          <InputJogador
            id="nota"
            name="overall_rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={nota}
            onChange={(event) => onNotaChange(event.target.value)}
            required
            placeholder="Ex.: 7.5"
          />
        </CampoJogador>
      )}

      {erro && <ErroCadastroJogador role="alert">{erro}</ErroCadastroJogador>}

      <BotaoSalvarJogador type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : textoBotao}
      </BotaoSalvarJogador>
    </CartaoFormularioJogador>
  );
}
