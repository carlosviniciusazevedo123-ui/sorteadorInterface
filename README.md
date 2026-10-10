# Sorteador

Interface React para cadastrar jogadores, sortear times, criar partidas,
registrar eventos e consultar resultados. O backend fica no projeto
`bancoDoSorteador`.

## Desenvolvimento

```sh
yarn install
yarn dev
```

O Vite encaminha `/api` para `http://localhost:3001`. Copie `.env.example`
para `.env.local` se precisar mudar os endereços:

- `VITE_API_URL`: endereço da API usado pelo navegador. O padrão é `/api`.
- `API_PROXY_TARGET`: backend usado pelo proxy de desenvolvimento e preview.

O sorteio considera `jogadoresPorTime` como vagas de jogadores de linha.
Quando a opção de goleiros está ativa, é necessário um goleiro adicional
por time, conforme a regra do backend.

O último sorteio fica disponível durante a sessão da aba. Ao sair ou trocar
de conta, os dados locais da sessão são removidos. Eventos e placar são
recuperados do backend, inclusive ao abrir um jogo em outro dispositivo.

## Verificações

```sh
yarn lint
yarn test
yarn build
```

Os testes do frontend simulam a API e verificam recuperação de placar,
validação do sorteio, sessão, respostas atrasadas, histórico e modais.
Para testar também o backend, execute `yarn test` no projeto `bancoDoSorteador`.
Os testes automatizados não substituem a verificação com o banco real.

## Publicação

```sh
yarn build
```

Publique a pasta `dist`. Configure a hospedagem para servir `index.html`
nas rotas do frontend, como `/jogo/...` e `/avaliacao/...`.

Há duas opções para conectar a API:

1. Manter `VITE_API_URL=/api` e configurar um proxy de `/api/` para o backend,
   removendo o prefixo `/api` ao encaminhar a solicitação.
2. Definir `VITE_API_URL=https://api.seu-dominio.com` antes do build. Nesse caso,
   o backend deve permitir a origem do frontend no CORS.

As variáveis `VITE_*` são incorporadas durante o build. Alterar o endereço
depois da compilação exige um novo build. O proxy do Vite não é incluído
nos arquivos de produção. `yarn preview` serve apenas para conferir o build
localmente; ele também usa `API_PROXY_TARGET`.
