---
name: premium-dental-website
description: Design and implement premium high-conversion dental and healthcare websites with sophisticated UI/UX, responsive layouts, Three.js experiences, GSAP or Framer Motion animations, accessibility, performance, SEO, local conversion strategy and production-quality frontend architecture.
compatibility: opencode
metadata:
  category: frontend
  specialty: premium-dental-websites
---

# Premium Dental Website Skill

## Objetivo

Esta skill deve ser utilizada para criar ou melhorar sites premium de:

- clínicas odontológicas;
- dentistas;
- ortodontistas;
- implantodontistas;
- clínicas de estética dental;
- clínicas médicas premium;
- profissionais da saúde que buscam forte percepção de valor.

O objetivo não é apenas produzir páginas bonitas.

O objetivo é combinar:

1. Branding.
2. UI/UX.
3. Motion design.
4. Desenvolvimento frontend.
5. Storytelling visual.
6. Conversão.
7. Responsividade.
8. Performance.
9. SEO.
10. Acessibilidade.
11. Experiências 3D quando agregarem valor.

---

# PRINCÍPIO CENTRAL

Qualidade > quantidade.

Cada recurso utilizado deve possuir função.

Evitar efeitos visuais adicionados apenas porque são possíveis.

O visitante deve perceber:

- confiança;
- tecnologia;
- exclusividade;
- cuidado;
- sofisticação;
- profissionalismo;
- segurança;
- excelência.

O design deve transmitir valor antes mesmo do visitante terminar de ler o Hero.

---

# DIREÇÃO DE ARTE

Criar uma estética:

- premium;
- minimalista;
- tecnológica;
- elegante;
- editorial;
- clínica;
- sofisticada;
- contemporânea.

Evitar aparência hospitalar genérica.

Evitar excesso de azul saturado.

Evitar aparência de template pronto.

A inspiração conceitual pode vir de:

- produtos premium;
- arquitetura;
- tecnologia;
- clínicas de luxo;
- design editorial;
- sites premiados;
- experiências digitais sofisticadas.

Nunca copiar uma marca existente.

---

# PALETA

Preferir:

- branco;
- off-white;
- grafite;
- preto suave;
- azul petróleo;
- azul profundo;
- azul acinzentado;
- tons neutros;
- detalhes claros e luminosos.

Usar gradientes somente quando contribuírem para profundidade.

Evitar:

- neon excessivo;
- azul hospital genérico;
- excesso de cores;
- gradientes aleatórios.

---

# TIPOGRAFIA

Priorizar famílias como:

- Manrope;
- Inter;
- DM Sans;
- Sora;
- Plus Jakarta Sans;
- Geist.

Criar hierarquia tipográfica real.

Headlines devem possuir:

- boa quebra de linha;
- contraste;
- ritmo;
- espaçamento;
- peso adequado;
- excelente leitura mobile.

Não utilizar texto gigantesco apenas para parecer moderno.

---

# DESIGN SYSTEM

Definir tokens reutilizáveis para:

- background;
- surface;
- foreground;
- muted;
- primary;
- secondary;
- border;
- accent;
- radius;
- spacing;
- shadows.

Manter consistência absoluta.

Criar componentes reutilizáveis para:

- Button;
- Container;
- Section;
- SectionHeading;
- Badge;
- Card;
- CTA;
- Input;
- Accordion;
- AnimatedReveal.

---

# GRID

Utilizar grid profissional.

Desktop:

máximo aproximadamente 1200–1440px.

Criar excelente uso de espaço negativo.

Não deixar todo conteúdo preso em cards.

Misturar:

- layouts editoriais;
- grids;
- elementos full-width;
- imagens grandes;
- composições assimétricas;
- seções minimalistas.

---

# MOTION DESIGN

As animações devem parecer parte da identidade.

Podem ser utilizados:

- Framer Motion;
- Motion;
- GSAP;
- GSAP ScrollTrigger.

Escolha apenas o necessário.

Animações permitidas:

- fade;
- reveal;
- mask reveal;
- text reveal;
- parallax discreto;
- scale;
- clip-path;
- stagger;
- smooth entrance;
- image reveal;
- cards aparecendo sequencialmente;
- contadores;
- elementos reagindo ao mouse;
- microinterações.

Evitar:

- bounce infantil;
- animações rápidas;
- elementos voando aleatoriamente;
- animação em absolutamente tudo;
- movimentos que prejudicam leitura.

---

# SCROLL

Criar sensação de narrativa.

O scroll deve revelar a experiência progressivamente.

Utilizar animações baseadas em scroll somente quando melhorarem a experiência.

As animações não podem prejudicar:

- performance;
- acessibilidade;
- mobile.

Respeitar:

prefers-reduced-motion.

---

# MICROINTERAÇÕES

Implementar microinterações premium.

Exemplos:

- botão com seta animada;
- hover com preenchimento;
- underline sofisticado;
- cards com profundidade;
- glow discreto;
- imagem com zoom de 1–3%;
- cursor contextual;
- magnetic button muito sutil;
- ícones reagindo ao hover.

Microinterações devem ser rápidas.

---

# 3D

Three.js deve ser utilizado quando realmente agregar valor.

Stack recomendada:

- three;
- @react-three/fiber;
- @react-three/drei.

Para clínicas odontológicas, priorizar:

- dente 3D;
- escultura abstrata dental;
- material cerâmico;
- vidro;
- porcelana;
- objeto translúcido;
- partículas discretas;
- visualização tecnológica.

O 3D deve transmitir:

precisão + tecnologia + sofisticação.

Nunca criar algo infantil.

---

# DENTE 3D

Quando houver modelo:

/public/models/tooth.glb

carregá-lo utilizando React Three Fiber.

Aplicar:

- iluminação de estúdio;
- Environment;
- sombras suaves;
- rotação muito lenta;
- resposta discreta ao mouse;
- material sofisticado;
- câmera cuidadosamente posicionada.

Implementar lazy loading.

Caso não exista tooth.glb:

não quebrar o site.

Criar fallback visual elegante.

Pode ser:

- composição WebGL abstrata;
- escultura procedural;
- objeto translúcido;
- imagem premium;
- gradient sculpture.

Estruturar o componente para permitir substituição posterior por:

/public/models/tooth.glb

---

# PERFORMANCE 3D

No mobile:

- reduzir DPR;
- reduzir partículas;
- diminuir complexidade;
- reduzir sombras;
- evitar post-processing pesado.

Canvas deve carregar dinamicamente quando possível.

Não carregar Three.js desnecessariamente acima de tudo.

Possuir fallback caso WebGL não funcione.

---

# HERO

O Hero precisa vender o projeto.

O visitante deve perceber qualidade em menos de 3 segundos.

Hero recomendado:

- altura próxima de 100svh;
- navbar premium;
- headline forte;
- subheadline curta;
- CTA;
- CTA secundário;
- prova de confiança;
- elemento visual marcante;
- 3D opcional;
- composição editorial.

Evitar Hero genérico:

Título + parágrafo + botão + foto retangular.

Criar composição realmente diferenciada.

---

# NAVBAR

Inicialmente:

transparente.

Após scroll:

- background translúcido;
- backdrop blur;
- borda suave;
- glass effect discreto.

Desktop:

logo;
navegação;
CTA.

Mobile:

menu hamburger premium.

Menu mobile deve possuir:

- animação;
- links grandes;
- CTA;
- excelente ergonomia.

---

# UX MOBILE

MOBILE NÃO É UMA VERSÃO DIMINUÍDA DO DESKTOP.

O layout deve ser redesenhado quando necessário.

Testar:

320px;
360px;
375px;
390px;
430px;
768px;
1024px;
1440px;
1920px.

No mobile:

- áreas clicáveis grandes;
- textos legíveis;
- animações reduzidas;
- 3D otimizado;
- nenhum overflow;
- nenhuma fonte exageradamente grande;
- menu confortável;
- formulários fáceis de usar.

---

# CONVERSÃO

O site precisa transformar visitantes em potenciais pacientes.

CTA principal:

Agendar avaliação

CTA secundário:

Falar pelo WhatsApp

Distribuir CTAs estrategicamente.

Não espalhar 30 CTAs pela página.

Utilizar:

- autoridade;
- clareza;
- tecnologia;
- segurança;
- equipe;
- tratamentos;
- resultados;
- facilidade de contato;
- prova social legítima.

---

# COPYWRITING

Evitar clichês.

Evitar:

"Seu sorriso é nossa prioridade."

"Transformando sonhos em realidade."

Preferir frases como:

"Seu sorriso merece uma nova experiência."

"Precisão que você percebe. Naturalidade que todos enxergam."

"Um novo padrão de cuidado."

"Odontologia criada ao redor de você."

"Tecnologia encontra cuidado."

"Resultados naturais começam com planejamento."

Manter textos relativamente curtos.

---

# ÉTICA

Nunca inventar informações e apresentá-las como fatos verdadeiros.

Dados fictícios ou demonstrativos devem ser facilmente substituíveis.

Exemplos:

- número de pacientes;
- anos de experiência;
- avaliações;
- CRO;
- depoimentos;
- resultados.

Nunca criar:

- depoimento falso apresentado como real;
- resultado falso apresentado como real;
- médico fictício apresentado como profissional verdadeiro.

Para demo, marcar conteúdo claramente no código como placeholder.

---

# TRATAMENTOS

Criar componentes para:

- Implantes;
- Facetas;
- Lentes de contato dental;
- Clareamento;
- Ortodontia;
- Alinhadores;
- Estética dental;
- Odontologia preventiva;
- Harmonização, caso aplicável.

Cards não devem parecer um dashboard SaaS.

Combinar imagem + tipografia + interação.

---

# BEFORE / AFTER

Quando utilizado:

criar slider interativo.

Suportar:

mouse;
touch;
teclado.

Adicionar labels:

ANTES
DEPOIS

Caso sejam imagens demonstrativas:

identificá-las como placeholders.

---

# ESPECIALISTAS

Cards podem possuir:

- foto;
- nome;
- especialidade;
- CRO;
- descrição;
- redes sociais.

Usar imagens premium.

Não exagerar informações.

---

# TECNOLOGIA

Criar seção de contraste forte.

Possíveis itens:

- scanner intraoral;
- planejamento digital;
- radiologia;
- impressão 3D;
- cirurgia guiada;
- alinhadores;
- fotografia odontológica.

A seção pode utilizar background escuro.

---

# PROVA SOCIAL

Podem existir:

- avaliações;
- depoimentos;
- números;
- resultados;
- certificações.

Nunca falsificar prova social.

Conteúdo demo deve ficar fácil de substituir.

---

# CONTATO

Priorizar baixo atrito.

Criar:

- WhatsApp;
- formulário;
- telefone;
- mapa;
- endereço;
- horário.

Formulário recomendado:

Nome
Telefone
Email
Tratamento
Mensagem

Não coletar dados clínicos ou médicos sensíveis desnecessariamente no formulário inicial.

---

# WHATSAPP

Criar configuração central:

WHATSAPP_NUMBER

Mensagem exemplo:

"Olá! Vim pelo site e gostaria de agendar uma avaliação."

URL deve ser construída corretamente.

---

# SEO

Implementar:

- metadata;
- title;
- description;
- canonical quando configurado;
- Open Graph;
- Twitter cards;
- sitemap;
- robots.

Utilizar JSON-LD adequado.

Preferir:

Dentist
ou
LocalBusiness

Campos reais devem vir da configuração do site.

Nunca colocar endereço fictício em produção sem sinalização.

---

# SEO LOCAL

Preparar estrutura para:

- cidade;
- bairro;
- endereço;
- telefone;
- especialidades;
- horários.

Não praticar keyword stuffing.

---

# ACESSIBILIDADE

Obrigatório:

- HTML semântico;
- aria-label quando necessário;
- alt;
- labels;
- foco visível;
- navegação por teclado;
- contraste;
- reduced motion;
- elementos clicáveis acessíveis.

---

# PERFORMANCE

Priorizar Core Web Vitals.

Utilizar:

- Next/Image;
- lazy loading;
- dynamic import;
- code splitting;
- fontes otimizadas;
- imagens WebP/AVIF;
- componentes leves.

Evitar:

- bibliotecas redundantes;
- loops de animação desnecessários;
- efeitos extremamente pesados;
- vídeo enorme carregando automaticamente em mobile;
- JavaScript excessivo.

---

# ARQUITETURA

Preferir:

Next.js
React
TypeScript
Tailwind CSS

Utilizar bibliotecas extras somente quando agregarem valor.

Estrutura sugerida:

/app
/components
/components/ui
/components/sections
/components/3d
/data
/hooks
/lib
/public/images
/public/models
/styles

Componentes sugeridos:

Navbar
Hero
DentalScene
About
Treatments
Technology
Stats
BeforeAfter
Specialists
ClinicGallery
Testimonials
Process
FAQ
Contact
Footer
WhatsAppButton

---

# CONFIGURAÇÃO CENTRAL

Criar:

/data/siteConfig.ts

Centralizar:

- clinicName;
- slogan;
- phone;
- whatsapp;
- email;
- address;
- mapsUrl;
- instagram;
- businessHours;
- treatments;
- specialists;
- testimonials;
- stats;
- faq;
- navigation.

O objetivo é permitir criar um novo site para outra clínica rapidamente.

---

# QUALIDADE DO CÓDIGO

Obrigatório:

- TypeScript corretamente tipado;
- componentes pequenos;
- nomes claros;
- código legível;
- sem duplicação desnecessária;
- sem arquivos gigantescos;
- sem console.log esquecido;
- sem warnings importantes;
- sem imports quebrados.

---

# VERIFICAÇÃO

Antes de finalizar qualquer projeto:

1. Rode lint.
2. Rode TypeScript check.
3. Rode build.
4. Corrija erros.
5. Verifique console.
6. Verifique mobile.
7. Verifique desktop.
8. Verifique overflow.
9. Verifique imagens.
10. Verifique menu.
11. Verifique links.
12. Verifique formulários.
13. Verifique 3D.
14. Verifique fallback.
15. Verifique reduced-motion.
16. Verifique SEO.
17. Verifique acessibilidade básica.
18. Verifique performance.

Somente considerar concluído depois disso.

---

# CRITÉRIO FINAL

Antes de finalizar, pergunte internamente:

"Isso parece um template ou um projeto feito por uma agência premium?"

Se parecer template:

melhore.

"Existe alguma seção visualmente genérica?"

Se existir:

melhore.

"As animações agregam algo?"

Se não:

remova.

"O mobile parece realmente planejado?"

Se não:

melhore.

"Eu apresentaria isso como um projeto profissional de alto valor?"

Se não:

continue refinando.
