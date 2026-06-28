# Correções e integrações aplicadas

- Banco SQLite criado automaticamente usando `DATABASE_PATH` ou `./database/app.db`.
- Migrations rodam na inicialização.
- Usuário admin inicial é criado se não houver usuários.
- Views EJS refeitas para não quebrar com partials ausentes.
- CSS/JS público incluídos.
- Formulários de exclusão corrigidos com `_method=DELETE`.
- Geração de códigos validada e com proteção contra duplicados.
- Botão “Usar” corrigido para marcar o código certo.
- API REST implementada nas rotas que estavam vazias.
- Exportação TXT cria a pasta `data` automaticamente.
- Sessão com cookies mais seguros.
- Projeto configurado para Node 20 via `engines` e `.nvmrc`.
- Adicionado menu **Automação**.
- Adicionado painel web `/automation` para configurar URL, seletores, login opcional e origem dos códigos.
- Adicionado envio um por um com Playwright.
- Automação pode usar códigos disponíveis do gerador e marcar como usados após envio.
