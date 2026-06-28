# Gerador de Códigos com Automação

## Correção importante de deploy

Este projeto deve rodar com **Node 20**. Se o ambiente usar Node 24, o `better-sqlite3` pode tentar compilar e quebrar.

No Render, configure:

```env
NODE_VERSION=20
NODE_ENV=production
DATABASE_PATH=./data/app.db
SESSION_SECRET=uma_chave_grande_aqui
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=sua_senha_forte
```

Build Command:

```bash
npm install && npx playwright install chromium
```

Start Command:

```bash
npm start
```

Se estiver no GitHub Codespaces, rode:

```bash
nvm install 20
nvm use 20
rm -rf node_modules package-lock.json
npm install
npx playwright install chromium
npm start
```

---

# Code Manager SaaS + Automação

Aplicação Node.js/Express para gerar, importar, exportar, controlar e automatizar o envio de códigos um por um em uma página externa.

## O que tem nesta versão

- Login com sessão.
- Dashboard com estatísticas.
- Geração de códigos por lote.
- Importação manual de códigos.
- Exportação de códigos disponíveis, usados ou todos.
- Histórico de uso.
- Banco SQLite inicializado automaticamente.
- Painel **Automação** integrado ao sistema.
- Automação com Playwright para abrir uma página, colar um código por vez e clicar em enviar/salvar.
- Opção de usar os códigos disponíveis do próprio gerador ou colar códigos manualmente.
- Opção de marcar os códigos como usados após envio.

## Requisitos

- Node.js 20
- npm

## Como rodar localmente

```bash
npm install
npx playwright install chromium
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

Troque `DEFAULT_ADMIN_PASSWORD` e `SESSION_SECRET` antes de usar em produção.

## Como usar a automação

1. Entre no sistema.
2. Vá no menu **Automação**.
3. Informe a URL da página onde os códigos serão colados.
4. Informe o seletor do campo do código.
5. Informe o seletor do botão de enviar/salvar.
6. Escolha se vai usar os códigos disponíveis do gerador ou colar manualmente.
7. Clique em **Executar automação**.

Exemplos de seletores:

```txt
#codigo
input[name="codigo"]
button[type="submit"]
#salvar
```

Para descobrir o seletor, abra a página, clique com o botão direito no campo, escolha **Inspecionar** e copie o `id`, `name` ou classe do elemento.

## Deploy no Render

Configuração básica:

```txt
Build Command: npm install && npx playwright install chromium
Start Command: npm start
```

Variáveis de ambiente recomendadas:

```env
NODE_ENV=production
NODE_VERSION=20
SESSION_SECRET=troque_por_uma_chave_grande
DATABASE_PATH=./data/app.db
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=troque_essa_senha
RATE_LIMIT_MAX=100
DB_DEBUG=false
```

Para uso real com SQLite no Render, use disco persistente:

```env
DATABASE_PATH=/var/data/app.db
```

E configure o Disk no Render com:

```txt
Mount Path: /var/data
```

## Atenção sobre automação

Use a automação apenas em páginas onde você tem permissão. Alguns sites podem bloquear automações ou exigir seletores diferentes depois de atualizações.

## Scripts

```bash
npm start           # roda em produção/local
npm run dev         # roda com nodemon
npm run init-db     # inicializa banco e usuário inicial
npm run check       # checa sintaxe dos arquivos principais
npm run install-browser # instala Chromium do Playwright
```
