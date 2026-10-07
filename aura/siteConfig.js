/* ============================================================
   AURA ODONTOLOGIA — ÚNICA fonte de verdade comercial.
   Edite APENAS este arquivo para trocar clínica, WhatsApp,
   tratamentos, equipe, depoimentos, estatísticas e FAQ.

   isDemo === true  → dados PLACEHOLDERS (demonstração).
     - JSON-LD publica apenas nome + descrição genérica;
     - selos "demonstrativo" aparecem na interface.
   isDemo === false → dados reais validados pela clínica.
     - JSON-LD completo (endereço, telefone, avaliações);
     - selos de demo somem automaticamente.

   Imagens: URLs externas temporárias com fallback automático.
   Futuro: aponte `imgBase: "images/"` e coloque os arquivos em
   `aura/images/` sem mudar o restante do código (ver README).
   Modelo 3D real: coloque em `aura/models/tooth.glb`.
   ============================================================ */
const SITE_CONFIG = {
  isDemo: true,

  clinic: {
    name: "Aura Odontologia",
    shortName: "Aura",
    slogan: "Odontologia criada ao redor de você.",
    description:
      "Odontologia moderna, estética dental, implantes, alinhadores e planejamento digital em uma experiência criada ao redor de você.",
  },

  contact: {
    phone: "(21) 3000-0000",
    phoneHref: "+55-21-3000-0000",
    whatsappNumber: "5521999999999", // <-- WHATSAPP_NUMBER configurável
    whatsappMsg: "Olá! Vim pelo site e gostaria de agendar uma avaliação.",
    email: "contato@auraodontologia.com.br",
    instagram: "https://instagram.com/aura.odontologia",
    instagramLabel: "@aura.odontologia",
    mapsUrl:
      "https://maps.google.com/?q=Av.+Atlântica,+1500,+Copacabana,+Rio+de+Janeiro",
  },

  address: {
    street: "Av. Atlântica, 1500 — Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    country: "BR",
  },

  businessHours: ["Seg–Sex · 8h às 20h", "Sáb · 8h às 13h"],

  navigation: [
    { label: "Início", href: "#inicio" },
    { label: "Tratamentos", href: "#tratamentos" },
    { label: "Tecnologia", href: "#tecnologia" },
    { label: "Especialistas", href: "#especialistas" },
    { label: "Clínica", href: "#clinica" },
    { label: "Contato", href: "#contato" },
  ],

  /* Tratamentos — fonte de verdade (renderizado via app.js).
     image: remota temporária; futuro: "images/trat-implantes.jpg" */
  treatments: [
    {
      slug: "implantes",
      name: "Implantes Dentários",
      description: "Raízes de titânio com cirurgia guiada e resultado natural.",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "facetas",
      name: "Facetas de Porcelana",
      description: "Lâminas ultrafinas para forma, cor e harmonia.",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "lentes",
      name: "Lentes de Contato Dental",
      description: "Transformação delicada com mínima intervenção.",
      image:
        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "clareamento",
      name: "Clareamento",
      description: "Dentes mais brancos com protocolos seguros e supervisionados.",
      image:
        "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "alinhadores",
      name: "Alinhadores Transparentes",
      description: "Correção invisível, confortável e removível.",
      image:
        "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "ortodontia",
      name: "Ortodontia",
      description: "Alinhamento preciso e funcional para todas as idades.",
      image:
        "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "estetica",
      name: "Estética Dental",
      description: "Design do sorriso personalizado para o seu rosto.",
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=70",
    },
    {
      slug: "preventiva",
      name: "Odontologia Preventiva",
      description: "Check-ups, profilaxia e cuidado contínuo do seu sorriso.",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=70",
    },
  ],

  /* PLACEHOLDER — substituir por equipe real (foto autorizada + CRO real) */
  specialists: [
    {
      name: "Dra. Marina Lemos",
      role: "Estética · Facetas",
      cro: "CRO-RJ 00000",
      description:
        "Referência em estética dental e reabilitação com cerâmicas.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80",
      instagram: "@dra.marinalemos",
      demo: true,
    },
    {
      name: "Dr. Rafael Torres",
      role: "Implantes · Cirurgia",
      cro: "CRO-RJ 00000",
      description: "Implantodontia guiada por computador e reabilitação oral.",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80",
      instagram: "@dr.rafaeltorres",
      demo: true,
    },
    {
      name: "Dra. Camila Prado",
      role: "Ortodontia · Alinhadores",
      cro: "CRO-RJ 00000",
      description: "Ortodontia invisível e planejamento digital do sorriso.",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&q=80",
      instagram: "@dra.camilaprado",
      demo: true,
    },
  ],

  /* PLACEHOLDER — substituir por depoimentos reais autorizados */
  testimonials: [
    {
      name: "Juliana M.",
      text: "Do primeiro atendimento ao resultado final, tudo impecável. Minhas facetas ficaram absolutamente naturais.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=70",
      rating: 5,
      demo: true,
    },
    {
      name: "Carlos H.",
      text: "Fiz dois implantes com cirurgia guiada. Zero dor, planejamento claro e acompanhamento próximo.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70",
      rating: 5,
      demo: true,
    },
    {
      name: "Fernanda L.",
      text: "O alinhador invisível coube na minha rotina. Ver a simulação do sorriso antes foi decisivo.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=70",
      rating: 5,
      demo: true,
    },
  ],

  /* PLACEHOLDER — dados demonstrativos */
  stats: [
    { value: 1500, prefix: "+", suffix: "", label: "Sorrisos transformados", demo: true },
    { value: 10, prefix: "+", suffix: "", label: "Anos de experiência", demo: true },
    { value: 98, prefix: "", suffix: "%", label: "Pacientes satisfeitos", demo: true },
    { value: 5.0, prefix: "", suffix: "", label: "Avaliação média", decimals: 1, demo: true },
  ],

  faq: [
    {
      q: "Como funciona a primeira avaliação?",
      a: "Escuta atenta, exame clínico e, quando indicado, imagens digitais. Você recebe diagnóstico claro e plano transparente, sem pressa.",
    },
    {
      q: "Quais tratamentos a clínica oferece?",
      a: "Implantes, facetas, lentes de contato dental, clareamento, ortodontia, alinhadores, estética dental e odontologia preventiva.",
    },
    {
      q: "A clínica utiliza planejamento digital?",
      a: "Sim. Scanner intraoral, simulação do sorriso e guias digitais para previsibilidade e conforto.",
    },
    {
      q: "Como funciona o atendimento com alinhadores?",
      a: "Escaneamento 3D, simulação do resultado, placas sob medida e acompanhamento próximo em cada etapa.",
    },
    {
      q: "Quais são as formas de pagamento?",
      a: "Pix, débito, crédito parcelado e opções de financiamento mediante aprovação. Tudo apresentado antes do início.",
    },
    {
      q: "Como faço para agendar?",
      a: "Pelo formulário do site, WhatsApp ou telefone. Retornamos rapidamente no horário comercial.",
    },
  ],

  /* Galeria — futura pasta local: "images/clinica-1.jpg" etc. */
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=700&q=75",
      alt: "Recepção da clínica",
    },
    {
      src: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=75",
      alt: "Consultório odontológico",
    },
    {
      src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=75",
      alt: "Equipamentos modernos",
    },
    {
      src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=700&q=75",
      alt: "Detalhe de atendimento clínico",
    },
  ],

  beforeAfter: {
    before: {
      src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
      alt: "Imagem demonstrativa — antes",
    },
    after: {
      src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
      alt: "Imagem demonstrativa — depois",
    },
    demoNote:
      "Imagens demonstrativas (placeholders) — substitua por casos reais autorizados.",
  },
};

window.SITE_CONFIG = SITE_CONFIG;
