# ✈️ AeroSky Airlines

Site institucional + e-commerce fictício premium para a companhia aérea **AeroSky Airlines**.

## Estrutura

```
/
├── index.html          → Página inicial completa
├── resultados.html     → Resultados (leva ao checkout via ?hora&preco&voo)
├── checkout.html/js    → Checkout em 4 etapas + confirmação (salva em localStorage)
├── vendas.html/js      → Página de vendas (sale, classes, combos, FAQ)
├── admin.html/js       → Painel admin (login demo, KPIs, reservas, voos, relatórios, CSV)
├── verify-email.js     → Widget de verificação por código (login + checkout)
├── api/send-code.js    → Serverless: gera e envia o código de 6 dígitos
├── api/verify-code.js  → Serverless: valida o código (HMAC, sem banco)
├── package.json        → Deps das functions (nodemailer, resend)
├── .env.example        → Variáveis necessárias
├── styles.css          → Design system completo (inclui checkout/vendas/admin)
├── app.js              → Lógica: menu, busca, ofertas, animações, modais
└── README.md
```

## Fluxo de compra (demo, sem backend)

`index.html` → busca → `resultados.html` → **Selecionar** → `checkout.html` (tarifa → passageiros/assentos → extras → pagamento) → reserva salva em `localStorage.aerosky_bookings` → visível em `admin.html`.

## Verificação de e-mail por código (Gmail e outros)

Fluxo: usuário informa o e-mail (login → "Entrar com código por e-mail", ou checkout → "Verificar e-mail") → recebe código de 6 dígitos válido por 10 min → digita no site → e-mail marcado como verificado.

APIs (Vercel Serverless, sem banco — token HMAC stateless):
- `POST /api/send-code` `{email}` → envia o e-mail, devolve `{token}`
- `POST /api/verify-code` `{email, code, token}` → `{ok:true}`

Ativação (obrigatória — sem isso o envio retorna erro claro):
1. Gmail: Conta Google → Segurança → Verificação em 2 etapas → **Senhas de app** → gere uma senha.
2. Vercel → Project → Settings → Environment Variables → adicione:
   `VERIFY_SECRET` (string aleatória longa), `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
   (Alternativa: `RESEND_API_KEY` + `RESEND_FROM` — tem prioridade se definida.)
3. Redeploy para aplicar as variáveis.

Limites: 3 envios / 10 min por e-mail; 5 tentativas por código.

## Newsletter + Supabase (e-mail de ofertas automático)

Quando alguém informa o e-mail em "Receba ofertas exclusivas", o site chama `POST /api/subscribe`, que salva em `newsletter_subscribers` e envia o e-mail **"🎉 Ofertas exclusivas de descontos"** (3 combos + cupom SKY10).

1. Supabase → SQL Editor → rode o `supabase.sql` (cria a tabela).
2. Vercel → Environment Variables → adicione `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` (Project Settings → API).
3. Provedor de envio: o mesmo da verificação (`GMAIL_*` ou `RESEND_API_KEY`).
4. Redeploy.

## Acesso admin demo

- URL: `admin.html` · usuário `admin@aerosky.com` · senha `sky123`
- Reservas do checkout aparecem em tempo real; dá para confirmar/cancelar/excluir, cadastrar voos e exportar CSV.

## Como rodar

Apenas abra `index.html` no navegador. Não precisa de build.

Para testar a busca: preencha origem/destino/datas → **Buscar voos** → abre `resultados.html` com voos fictícios gerados.

## Próximas páginas (estrutura pronta)

O `app.js` já possui helpers (`AeroSky.store`, `AeroSky.toast`, `AeroSky.formatBRL`) e o `resultados.html`
mostra o padrão para criar:

- `comprar.html` (checkout)
- `checkin.html`
- `login.html` / `perfil.html`
- `minhas-viagens.html`
- `clube.html`

Basta copiar o `<header>` / `<footer>` de `index.html` (componentes reutilizáveis demarcados com comentários).

## Paleta

- Azul-escuro: `#0A1C3D` / `#071230`
- Azul-claro: `#2E9BFF` / `#7CC6FF`
- Branco: `#FFFFFF` / `#F4F7FC`
- Dourado: `#C9A24B`

Tipografia: `Sora` (títulos) + `Inter` (texto).
