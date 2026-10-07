# Preferências do usuário (standing instructions)

- Quando o usuário pedir para **hospedar/publicar na Vercel**, fazer o **deploy automático**:
  1. `git add -A` + commit + `git push origin main`
  2. `npx vercel --prod --yes` (requer autenticação prévia — ver abaixo)
  3. Verificar a URL de produção com curl e reportar o status.
- Pré-requisito (uma única vez): usuário executa `npx vercel login` no terminal
  OU fornece `VERCEL_TOKEN`. Sem token, o deploy via CLI não é possível —
  nesse caso, orientar a conectar o GitHub no dashboard (deploy automático por push).
- Projeto Vercel: `aerosky-airlines` · Repo: `santxze/erosky-airlines` · branch `main`.
