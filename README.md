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
├── styles.css          → Design system completo (inclui checkout/vendas/admin)
├── app.js              → Lógica: menu, busca, ofertas, animações, modais
└── README.md
```

## Fluxo de compra (demo, sem backend)

`index.html` → busca → `resultados.html` → **Selecionar** → `checkout.html` (tarifa → passageiros/assentos → extras → pagamento) → reserva salva em `localStorage.aerosky_bookings` → visível em `admin.html`.

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
