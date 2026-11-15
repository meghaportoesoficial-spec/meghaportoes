/* ==========================================================
   MEGHA PORTÕES — CONFIGURAÇÃO
   Edite aqui telefones, textos e PREÇOS DE REFERÊNCIA.
   Os preços abaixo são valores de exemplo (estimativa) —
   troque pelos valores reais do Carlito.
   ========================================================== */
window.MEGHA = {
  nome: 'Megha Portões',
  dono: 'Carlito Santos',
  slogan: 'Lado a lado da Tecnologia e Inovação',
  cidade: 'Camaçari – BA',
  endereco: 'Rua Maria Clara Garcez, S/N, Bairro Monte Negro, Estradas da Cascalheiras – Camaçari – BA',
  instagram: 'https://www.instagram.com/meghaportoes2025/',
  // WhatsApp principal (recebe os orçamentos). Formato: 55 + DDD + número
  whatsPrincipal: '5571988604484',
  telefones: [
    { label: '71 98860-4484', num: '5571988604484' },
    { label: '71 99950-5432', num: '5571999505432' }
  ],
  storageKey: 'megha_pedidos_v1',
  perfilKey: 'megha_perfil_v1',
  rascunhoKey: 'megha_rascunho_v1',

  /* Preço por m² (ou por metro linear, ver "unid") para cada material */
  materiais: {
    aluminio: { nome: 'Alumínio',        preco: 650, desc: 'Leve, não enferruja e dura anos.' },
    aco:      { nome: 'Aço / Metalon',   preco: 480, desc: 'Resistência máxima e ótimo custo-benefício.' },
    acm:      { nome: 'ACM',             preco: 720, desc: 'Painel composto de alumínio, acabamento premium.' },
    ripado:   { nome: 'Ripado',          preco: 850, desc: 'Visual de madeira com a durabilidade do alumínio.' },
    vidro:    { nome: 'Vidro temperado', preco: 980, desc: 'Transparência e segurança, até 5x mais resistente.' },
    mdf:      { nome: 'MDF / Madeirado', preco: 900, desc: 'Marcenaria sob medida para dentro de casa.' }
  },

  cores: {
    metal: [
      ['Preto fosco', '#1a1c21'], ['Grafite', '#3b414b'], ['Branco', '#eef1f5'],
      ['Prata', '#aab3be'], ['Bronze', '#6b4a2f'], ['Azul', '#1f4fd6'],
      ['Amarelo', '#f6bb00'], ['Vermelho', '#c42a2a'], ['Verde', '#1f7a4d']
    ],
    madeira: [
      ['Freijó', '#b9803f'], ['Cedro', '#9a4f26'], ['Nogueira', '#5b3a24'],
      ['Carvalho', '#c9a36a'], ['Ébano', '#2b211c']
    ],
    vidro: [
      ['Incolor', '#bfeee8'], ['Verde', '#3fb89a'], ['Fumê', '#5a6672'], ['Bronze', '#b88a52']
    ],
    mdf: [
      ['Freijó', '#b9803f'], ['Grafite', '#3b414b'], ['Branco', '#eef1f5'],
      ['Off-white', '#e0d8c8'], ['Azul petróleo', '#1d4a5c'], ['Preto fosco', '#1a1c21']
    ]
  },

  /* Serviços do orçamento */
  servicos: {
    portao: {
      nome: 'Portão', icone: 'gate', unid: 'm²',
      tipos: [['correr', 'De correr'], ['pivotante', 'Pivotante'], ['basculante', 'Basculante']],
      materiais: ['aluminio', 'aco', 'acm', 'ripado', 'vidro'],
      w: [1.5, 6, 3.5], h: [1.2, 3, 2.2],
      extras: [['motor', 'Automação (motor + controle)', 1450], ['fechadura', 'Fechadura eletrônica', 380], ['interfone', 'Interfone / botoeira', 290]],
      instalacao: [250, 18]  // fixo + R$ por m²
    },
    esquadria: {
      nome: 'Esquadria em Alumínio', icone: 'window', unid: 'm²',
      tipos: [['correr', 'Janela de correr'], ['maximar', 'Janela maxim-ar'], ['giro', 'Porta de giro']],
      materiais: ['aluminio'],
      w: [0.6, 4, 1.5], h: [0.5, 2.6, 1.2],
      extras: [['vidro-temp', 'Vidro temperado nos painéis', 220], ['tela', 'Tela anti-inseto', 110], ['persiana', 'Persiana integrada', 540]],
      instalacao: [120, 22]
    },
    temperado: {
      nome: 'Vidro Temperado', icone: 'door', unid: 'm²',
      tipos: [['porta', 'Porta de giro'], ['box', 'Box de banheiro'], ['divisoria', 'Divisória / Fixo']],
      materiais: ['vidro'],
      w: [0.6, 4, 1.2], h: [1.0, 2.8, 2.1],
      extras: [['puxador', 'Puxador inox premium', 260], ['pelicula', 'Película decorativa', 180], ['fechadura', 'Fechadura de embutir', 240]],
      instalacao: [150, 30]
    },
    acm: {
      nome: 'ACM (Fachadas)', icone: 'panel', unid: 'm²',
      tipos: [['fachada', 'Fachada'], ['comunicacao', 'Comunicação visual'], ['cobertura', 'Cobertura / Marquise']],
      materiais: ['acm'],
      w: [1, 12, 4], h: [0.6, 5, 2.4],
      extras: [['led', 'Iluminação em LED', 620], ['logo', 'Letreiro / logomarca', 480]],
      instalacao: [300, 35]
    },
    ripado: {
      nome: 'Ripado', icone: 'slats', unid: 'm²',
      tipos: [['parede', 'Painel de parede'], ['fachada', 'Fachada'], ['forro', 'Forro / Pergolado']],
      materiais: ['ripado'],
      w: [0.8, 8, 3], h: [0.6, 3.5, 2.4],
      extras: [['led', 'Iluminação em LED atrás', 540], ['tv', 'Recorte para TV', 160]],
      instalacao: [200, 28]
    },
    gabinete: {
      nome: 'Gabinete', icone: 'cabinet', unid: 'm',
      tipos: [['cozinha', 'Cozinha'], ['banheiro', 'Banheiro'], ['sala', 'Balcão / Sala']],
      materiais: ['mdf', 'aluminio'],
      w: [0.6, 5, 2.2], h: [0.5, 1, 0.8],
      extras: [['tampo', 'Tampo em pedra', 780], ['gavetas', 'Gavetas com amortecedor', 420], ['led', 'LED embutido', 260]],
      instalacao: [180, 40],
      porMetro: 1850   // preço base por metro linear (substitui m²)
    },
    guardacorpo: {
      nome: 'Guarda-corpo', icone: 'rail', unid: 'm',
      tipos: [['vidro', 'Com vidro'], ['tubular', 'Tubular'], ['cabos', 'Cabos de aço']],
      materiais: ['aluminio', 'aco', 'vidro'],
      w: [1, 10, 3], h: [0.9, 1.3, 1.1],
      extras: [['corrimao', 'Corrimão superior', 190], ['led', 'LED no corrimão', 230]],
      instalacao: [200, 55],
      porMetro: 520
    },
    corrimao: {
      nome: 'Corrimão', icone: 'handrail', unid: 'm',
      tipos: [['escada', 'Escada'], ['rampa', 'Rampa'], ['parede', 'Fixado na parede']],
      materiais: ['aluminio', 'aco'],
      w: [1, 10, 3], h: [0.8, 1.1, 0.95],
      extras: [['led', 'LED no corrimão', 230], ['duplo', 'Corrimão duplo', 250]],
      instalacao: [150, 45],
      porMetro: 310
    }
  },

  etapas: ['Recebido', 'Em análise', 'Medição', 'Produção', 'Instalação', 'Concluído']
};
