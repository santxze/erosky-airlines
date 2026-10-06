# ✈️ AeroSky Airlines

Site institucional + e-commerce fictício premium para a companhia aérea **AeroSky Airlines**.

## Estrutura

```
/
├── index.html          → Página inicial completa
├── resultados.html     → Página de resultados de voos (lê ?origem&destino&ida&volta&pax&classe)
├── styles.css          → Design system completo (variáveis, componentes, responsivo)
├── app.js              → Lógica: menu, busca, ofertas, animações, modais, validações
└── README.md
```

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
