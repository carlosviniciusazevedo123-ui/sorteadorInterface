export function mensagemDoErro(error, padrao = 'Ocorreu um erro.') {
  const mensagem = error.response?.data?.error ?? error.response?.data?.message;
  const mensagens = Array.isArray(mensagem) ? mensagem : [mensagem];
  const traducoes = mensagens.map((item) =>
    typeof item === 'string' ? errosTraduzidos[item.replace(/\.$/, '')] : null
  );
  if (traducoes.length && traducoes.every(Boolean))
    return [...new Set(traducoes)].join(' ');
  if (error.response?.status === 429)
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if (error.response?.status === 401)
    return 'Sua sessão expirou. Entre novamente para continuar.';
  if (error.response?.status === 409)
    return 'Este jogador já participa do sorteio ou não há vaga compatível.';
  if (error.response?.status === 403)
    return 'Você não tem permissão para alterar este sorteio.';
  return padrao;
}

const errosTraduzidos = {
  'Invalid email or password': 'E-mail ou senha incorretos.',
  'Email is already registered': 'Este e-mail já está cadastrado.',
  'A player with this name already exists':
    'Já existe um jogador com esse nome.',
  'Player not found': 'Jogador não encontrado.',
  'Match not found': 'Partida não encontrada.',
  'Game not found': 'Jogo não encontrado.',
  'Game not found in this match': 'Jogo não encontrado nesta partida.',
  'Draw not found': 'Sorteio não encontrado.',
  'No permission to modify this draw':
    'Você não tem permissão para alterar este sorteio.',
  'You do not have permission to view this match':
    'Você não tem permissão para visualizar esta partida.',
  'Match is already finished': 'Esta partida já foi finalizada.',
  'Game cannot be started': 'Este jogo não pode ser iniciado.',
  'Game cannot be finished': 'Este jogo não pode ser finalizado.',
  "There aren't enough players": 'Não há jogadores suficientes.',
  "There aren't enough goalkeepers": 'Não há goleiros suficientes.',
  'There are no more roster spots': 'Não há mais vagas nos times.',
  'Duplicate players were selected': 'Há jogadores repetidos na seleção.',
  'One or more selected players were not found':
    'Um ou mais jogadores selecionados não foram encontrados.',
  'The game is not underway': 'O jogo não está em andamento.',
  'The match is not underway': 'A partida não está em andamento.',
  'The game time has expired': 'O tempo do jogo terminou.',
  'The game is not in progress': 'O jogo não está em andamento.',
  'The game is not paused': 'O jogo não está pausado.',
  'Invalid evaluation link': 'Link de avaliação inválido.',
  'The evaluation link has expired': 'O link de avaliação expirou.',
  'The evaluation period for this match has ended':
    'O prazo de avaliação desta partida terminou.',
  'The evaluation period for this match has expired':
    'O prazo de avaliação desta partida terminou.',
  'This player did not participate in this match':
    'Este jogador não participou desta partida.',
  'The outgoing and incoming players must be different':
    'Os jogadores que saem e entram devem ser diferentes.',
  'Both players must belong to this team in the match':
    'Os dois jogadores devem pertencer a este time.',
  'The outgoing player must be active and the incoming player must be a reserve':
    'Escolha um jogador ativo para sair e uma reserva para entrar.',
  'A reserve player cannot score or assist while off the field':
    'Uma reserva fora de campo não pode registrar gol ou assistência.',
  'Missing game completion date':
    'Não foi possível identificar o último jogo: data de finalização indisponível.',
};
