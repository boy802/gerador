# Automação de códigos com Playwright

Esse projeto abre uma página, cola os códigos **um por um**, clica no botão de envio/salvar e passa para o próximo código.

## 1. Instalar

```bash
npm install
npx playwright install chromium
```

## 2. Configurar o `.env`

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois edite o `.env`:

```env
TARGET_URL=https://site.com/pagina-dos-codigos
CODE_SELECTOR=input[name="codigo"]
SUBMIT_SELECTOR=button[type="submit"]
DELAY_MS=1500
HEADLESS=false
```

## 3. Colocar os códigos

Edite `codigos.txt` e coloque um código por linha:

```txt
CODIGO001
CODIGO002
CODIGO003
```

## 4. Rodar

```bash
npm start
```

## Como achar o CODE_SELECTOR e SUBMIT_SELECTOR

Na página onde cola o código:

1. Clique com botão direito no campo.
2. Clique em **Inspecionar**.
3. Veja se o campo tem `id`, `name` ou outro atributo.

Exemplos:

```html
<input id="code">
```

Use:

```env
CODE_SELECTOR=#code
```

Outro exemplo:

```html
<input name="codigo">
```

Use:

```env
CODE_SELECTOR=input[name="codigo"]
```

Para o botão:

```html
<button id="salvar">Salvar</button>
```

Use:

```env
SUBMIT_SELECTOR=#salvar
```

## Se tiver login

Preencha no `.env`:

```env
LOGIN_URL=https://site.com/login
LOGIN_EMAIL=seu-email
LOGIN_PASSWORD=sua-senha
LOGIN_EMAIL_SELECTOR=input[type="email"]
LOGIN_PASSWORD_SELECTOR=input[type="password"]
LOGIN_SUBMIT_SELECTOR=button[type="submit"]
```

## GitHub

Pode subir esse projeto direto no GitHub. Não suba o arquivo `.env`, porque ele pode ter senha.

O `.gitignore` já está configurado para ignorar `.env` e `node_modules`.
