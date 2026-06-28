# Correção do erro better-sqlite3 / Node 24

O erro de build com vários arquivos `./src/*.lzz` do `better-sqlite3` acontece quando o ambiente está usando Node 24 com uma versão antiga/incompatível do pacote nativo.

Este pacote foi ajustado para:

- travar Node 20 com `.nvmrc` e `.node-version`;
- declarar `engines.node = 20.x` no `package.json`;
- adicionar `render.yaml` com `NODE_VERSION=20`;
- atualizar `better-sqlite3` para a linha `^12.0.0`.

No Render, mesmo com esses arquivos, confira manualmente em **Environment**:

```env
NODE_VERSION=20
```

Depois rode:

```txt
Manual Deploy > Clear build cache & deploy
```
