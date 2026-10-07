# AURA ODONTOLOGIA — Site premium (pasta `aura/`)

Site estático de alto padrão, sem build. O projeto AeroSky da raiz foi preservado.
Identidade: Luxury Dental Tech — off-white + grafite + azul petróleo (Sora + Manrope),
3D em porcelana via Three.js (lazy, pausável), conversão via WhatsApp.

## Abrir

Abra `aura/index.html` no navegador, ou sirva a pasta e acesse `/aura/`:

```bash
npx serve .
# → http://localhost:3000/aura/
```

## Estrutura

```
aura/
├── index.html    → casca semântica; conteúdo comercial renderizado via siteConfig
├── styles.css    → design system (tokens, seções, responsivo 375–1920px)
├── app.js        → render + interações (menu, reveals, contadores, slider, FAQ, lightbox, form→WhatsApp)
├── tooth3d.js    → escultura 3D (tenta models/tooth.glb, senão procedural premium) + fallback SVG
├── siteConfig.js → ÚNICA fonte de verdade comercial (edite aqui)
├── models/       → coloque aqui o tooth.glb real (pasta criada sob demanda)
├── images/       → futura pasta local de imagens (ver abaixo)
├── robots.txt / sitemap.xml → SEO (ajuste o domínio)
└── README.md     → este arquivo
```

## Editar siteConfig (única fonte de verdade)

Tudo comercial vive em `aura/siteConfig.js`: nome, telefone, WhatsApp,
mensagem, e-mail, Instagram, endereço, Google Maps, horários, tratamentos
(`{name, description, image, slug}`), especialistas
(`{name, role, cro, description, image, instagram, demo}`), depoimentos,
estatísticas, FAQ, galeria e before/after. O HTML/JS apenas renderiza —
não duplique dados fora dele.

```js
isDemo: true, // demonstração → selos visíveis + JSON-LD mínimo
whatsappNumber: "5521999999999", // DDI+DDD+número, só dígitos
```

## Alterar WhatsApp

Troque `contact.whatsappNumber` e `contact.whatsappMsg` no `siteConfig.js`.
Todos os botões (`#waFloat`, `#ctaWhats`, `#infoWhats`, `#footWhats`) e o
formulário passam a usar o novo número automaticamente.

## Dados demonstrativos → produção

1. Substitua estatísticas, equipe, depoimentos e endereço no `siteConfig.js`.
2. Remova `demo: true` de cada item real.
3. Quando **tudo** for real, mude `isDemo: false` — o JSON-LD passa a
   publicar endereço/telefone e os selos "demonstrativo" somem.

## Trocar imagens

Hoje: URLs externas temporárias com fallback automático para `picsum.photos`
(`onerror` em cada `<img>`). Para usar arquivos locais:

1. Crie `aura/images/` e copie os arquivos (ex.: `trat-implantes.jpg`).
2. No `siteConfig.js`, troque cada `image`/`src` por `"images/trat-implantes.jpg"`.
3. Nenhuma mudança de código é necessária — os renders usam o valor do config.

## Trocar modelo 3D

1. Coloque o arquivo em `aura/models/tooth.glb`.
2. O `tooth3d.js` detecta e carrega automaticamente (tenta `models/`,
   `./models/`, `public/models/`, `/models/`); o material porcelana é
   aplicado ao modelo. Sem GLB, a escultura procedural premium é usada.
3. Sem WebGL ou com `prefers-reduced-motion`: fallback SVG estático.

## Integrar backend no formulário (quando existir)

Comportamento atual (honesto, sem backend falso): valida, monta mensagem
organizada com todos os campos e **abre o WhatsApp** da clínica, exibindo
"Estamos abrindo o WhatsApp para concluir seu atendimento."

Para enviar a um backend real, implemente em `app.js`:

```js
async function sendLeadToAPI(lead) {
  const r = await fetch("https://sua-api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  return { ok: r.ok }; // → exibe confirmação de envio real
}
```

O objeto `lead` contém: `nome, telefone, email, tratamento, mensagem,
origem, em`. Nunca colete dados clínicos sensíveis no formulário inicial.

## Publicar na Vercel

Opção A (pasta como parte do repo): suba o repositório e aponte a Vercel
para a raiz — o site responde em `/aura/`. Opção B (domínio dedicado):
copie o conteúdo de `aura/` para um novo repositório/projeto e publique —
ajuste `robots.txt`, `sitemap.xml` e a tag `canonical` para o domínio final
e gere `/og-image.jpg`.

## Performance e acessibilidade

Three.js carrega sob demanda (lazy), pausa fora da viewport e com aba
oculta; DPR ≤ 1.5 no mobile e ≤ 2 no desktop. Cursor customizado só em
`hover+pointer fino`, sem `prefers-reduced-motion`, e pausado com aba
oculta. Menu mobile trava scroll e fecha com Escape; lightbox gerencia
foco; slider antes/depois com teclado (←/→/Home/End) e `role="slider"`.
