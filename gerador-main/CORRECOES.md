# Correções aplicadas

- Banco SQLite agora é criado automaticamente usando `DATABASE_PATH` ou `./database/app.db`.
- Migrations rodam na inicialização.
- Usuário admin inicial é criado se não houver usuários.
- Views EJS foram refeitas para não quebrar com partials ausentes.
- Foram adicionados `public/css/style.css`, `public/js/main.js` e `public/js/dashboard.js`.
- Dashboard agora busca estatísticas em `/api/stats`.
- Formulários de exclusão agora funcionam com `_method=DELETE`.
- Geração de códigos agora valida tamanho/quantidade e evita duplicados com tentativas extras.
- Botão “Usar” agora usa o código selecionado.
- API REST recebeu implementação real em rotas que estavam vazias.
- Exportação TXT cria a pasta `data` automaticamente.
- Sessão recebeu cookies mais seguros.
- Projeto configurado para Node 20 via `engines` e `.nvmrc`.
