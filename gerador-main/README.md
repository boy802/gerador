# Code Manager SaaS

Aplicação em Node.js/Express para gerar, importar, exportar e controlar o uso de códigos.

## O que foi corrigido nesta versão

- Inicialização automática do banco SQLite com migrations.
- Criação automática do usuário inicial quando não existe nenhum usuário.
- Correção das views EJS, que antes dependiam de partials inexistentes.
- Inclusão de CSS/JS público para a interface carregar corretamente.
- Correção dos formulários de exclusão com suporte a `_method=DELETE`.
- Correção da geração de códigos com validação de quantidade/tamanho e tentativa contra duplicados.
- Correção do botão “Usar” para marcar o código selecionado, não sempre o primeiro disponível.
- Correção dos endpoints REST que estavam vazios.
- Cookies de sessão com `httpOnly`, `sameSite` e `secure` automático em produção.
- Exportação TXT criando a pasta `data` automaticamente.
- Dashboard funcional usando `/api/stats`.

## Requisitos

- Node.js 18+
- npm

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Depois acesse:

```txt
http://localhost:3000
```

Primeiro acesso padrão, caso você não altere no `.env`:

```txt
Usuário: admin
Senha: admin123
```

> Troque `DEFAULT_ADMIN_PASSWORD` e `SESSION_SECRET` antes de usar em produção.

## Scripts

```bash
npm start      # roda em produção/local
npm run dev    # roda com nodemon
npm run init-db # inicializa banco e usuário inicial
npm run check   # checa sintaxe do server.js
```

## Variáveis de ambiente

Veja `.env.example`.

## Deploy

Compatível com Render e serviços Node.js similares. Configure no ambiente:

- `PORT`
- `NODE_ENV=production`
- `SESSION_SECRET`
- `DATABASE_PATH`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`
