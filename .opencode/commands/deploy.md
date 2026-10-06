---
description: Deploy do site para a Vercel (produção) em 1 passo
---

Faça o deploy deste projeto (site estático AeroSky: index.html, resultados.html, styles.css, app.js) para a Vercel em produção.

Passos obrigatórios:
1. Não crie `vercel.json` — site estático puro funciona com zero config. Apenas garanta que existe `.vercelignore` com `.vercel`, `.opencode` e `README.md`.
2. Verifique se a Vercel CLI está disponível (`npx -y vercel --version`). Se não estiver logado, peça ao usuário para rodar `npx vercel login` e aguarde.
3. Rode o deploy de produção: `npx -y vercel --prod --yes`
4. Mostre no final: URL de produção, URL de preview (se houver) e o que foi publicado.

Não peça confirmação extra, execute direto. Se der erro de autenticação, explique em 2 linhas como resolver.
