import { Campus, Modality, CollectiveTeam, Match, Regulation, Notice } from '../types/database';

export const INITIAL_CAMPUSES: Campus[] = [
  { id: 'campus-brasilia', name: 'Campus Brasília', short_name: 'Brasília', city: 'Brasília - DF' },
  { id: 'campus-taguatinga', name: 'Campus Taguatinga', short_name: 'Taguatinga', city: 'Taguatinga - DF' },
  { id: 'campus-ceilandia', name: 'Campus Ceilândia', short_name: 'Ceilândia', city: 'Ceilândia - DF' },
  { id: 'campus-gama', name: 'Campus Gama', short_name: 'Gama', city: 'Gama - DF' },
  { id: 'campus-planaltina', name: 'Campus Planaltina', short_name: 'Planaltina', city: 'Planaltina - DF' },
  { id: 'campus-estrutural', name: 'Campus Estrutural', short_name: 'Estrutural', city: 'Estrutural - DF' },
  { id: 'campus-riacho-fundo', name: 'Campus Riacho Fundo', short_name: 'Riacho Fundo', city: 'Riacho Fundo - DF' },
  { id: 'campus-samambaia', name: 'Campus Samambaia', short_name: 'Samambaia', city: 'Samambaia - DF' },
  { id: 'campus-sao-sebastiao', name: 'Campus São Sebastião', short_name: 'São Sebastião', city: 'São Sebastião - DF' },
  { id: 'campus-recanto-emas', name: 'Campus Recanto das Emas', short_name: 'Recanto das Emas', city: 'Recanto das Emas - DF' },
  { id: 'reitoria', name: 'Reitoria IFB', short_name: 'Reitoria', city: 'Brasília - DF' },
];

export const INITIAL_MODALITIES: Modality[] = [
  {
    id: 'futsal-masc',
    name: 'Futsal',
    category: 'Masculino',
    type: 'coletiva',
    stage: 'Geral',
    format: 'grupos_3',
    icon: 'Flame',
    rules_summary: '3 grupos de 3. Avançam os 1ºs colocados de cada grupo. A 4ª vaga é disputada em playoff entre os três 2ºs colocados.',
    order_index: 1,
  },
  {
    id: 'futsal-fem',
    name: 'Futsal',
    category: 'Feminino',
    type: 'coletiva',
    stage: 'Geral',
    format: 'triangular',
    icon: 'Trophy',
    rules_summary: 'Triangular em turno único. Vitória: 3 pts; Empate com vitória nos pênaltis: 2 pts; Empate com derrota nos pênaltis: 1 pt.',
    order_index: 2,
  },
  {
    id: 'volei-misto',
    name: 'Vôlei de Quadra',
    category: 'Misto',
    type: 'coletiva',
    stage: 'Geral',
    format: 'grupos_4',
    icon: 'Activity',
    rules_summary: '2 grupos de 4 equipes (mínimo 2 mulheres em quadra). Melhor de 3 sets (25/15 pts). Semifinais cruzadas (1ºA x 2ºB, 1ºB x 2ºA), 3º e Final.',
    order_index: 3,
  },
  {
    id: 'basquete-masc',
    name: 'Basquete 3x3',
    category: 'Masculino',
    type: 'coletiva',
    stage: 'Geral',
    format: 'grupos_3',
    icon: 'Award',
    rules_summary: '2 grupos de 3 equipes. 10 minutos corridos ou 21 pontos. Semifinais (1ºA x 2ºB, 1ºB x 2ºA) e Final.',
    order_index: 4,
  },
  {
    id: 'basquete-misto',
    name: 'Basquete 3x3',
    category: 'Misto',
    type: 'coletiva',
    stage: 'Geral',
    format: 'triangular',
    icon: 'Award',
    rules_summary: 'Triangular em turno único (todos contra todos). A pontuação final define o pódio.',
    order_index: 5,
  },
  {
    id: 'volei-praia-masc',
    name: 'Vôlei de Praia',
    category: 'Masculino',
    type: 'coletiva',
    stage: 'Geral',
    format: 'grupos_3',
    icon: 'Sun',
    rules_summary: '3 grupos de 3 duplas. Avançam 1ºs de cada grupo + melhor 2º geral por índice técnico para as Semifinais.',
    order_index: 6,
  },
  {
    id: 'futevolei-masc',
    name: 'Futevôlei',
    category: 'Masculino',
    type: 'coletiva',
    stage: 'Geral',
    format: 'pontos_corridos',
    icon: 'Disc',
    rules_summary: '5 duplas em turno único de pontos corridos. Set único de 18 pontos corridos com vantagem de 2 pontos.',
    order_index: 7,
  },
  {
    id: 'futevolei-misto',
    name: 'Futevôlei',
    category: 'Misto',
    type: 'coletiva',
    stage: 'Geral',
    format: 'confronto_direto',
    icon: 'Disc',
    rules_summary: 'Confronto direto em partida final única, disputada em melhor de 3 sets de 12 pontos com vantagem de 2 pontos.',
    order_index: 8,
  },
  {
    id: 'queimada-mista',
    name: 'Queimada',
    category: 'Mista',
    type: 'coletiva',
    stage: 'Geral',
    format: 'chave_unica',
    icon: 'Target',
    rules_summary: 'Chave única com 6 equipes em turno único. As 4 melhores avançam para Semifinais (1ºx4º, 2ºx3º), disputa de 3º e Final.',
    order_index: 9,
  },
  {
    id: 'handebol-misto',
    name: 'Handebol Adaptado',
    category: 'Misto',
    type: 'coletiva',
    stage: 'Geral',
    format: 'chave_unica',
    icon: 'Zap',
    rules_summary: '4 equipes em chave única. Regras mistas adaptadas com rodízio a cada 5 minutos. Semifinais (1ºx4º, 2ºx3º), 3º e Final.',
    order_index: 10,
  },
  {
    id: 'xadrez-aberto',
    name: 'Xadrez',
    category: 'Aberto',
    type: 'individual',
    stage: 'Primeiro Lance',
    format: 'suico',
    icon: 'Compass',
    rules_summary: 'Sistema Suíço em 5 rodadas com controle de tempo rápido (10 a 15 min). Não há eliminação por derrota.',
    order_index: 11,
  },
  {
    id: 'damas-aberto',
    name: 'Damas',
    category: 'Aberto',
    type: 'individual',
    stage: 'Primeiro Lance',
    format: 'grupos_eliminatoria',
    icon: 'Layers',
    rules_summary: 'Chaves de 4 jogadores em turno único. Classificam-se os 2 melhores de cada chave para as Semifinais e Final.',
    order_index: 12,
  },
  {
    id: 'tenis-mesa-geral',
    name: 'Tênis de Mesa',
    category: 'Fem e Absoluto',
    type: 'individual',
    stage: 'Primeiro Lance',
    format: 'grupos_eliminatoria',
    icon: 'CircleDot',
    rules_summary: 'Categorias Feminino e Absoluto em grupos seguidos de mata-mata. Partidas em melhor de 3 ou 5 sets de 11 pontos.',
    order_index: 13,
  },
  {
    id: 'natacao-geral',
    name: 'Natação',
    category: 'Masc e Fem',
    type: 'individual',
    stage: 'Geral',
    format: 'cronometrado',
    icon: 'Droplets',
    rules_summary: 'Provas individuais de 25m, 50m e 100m Livre em séries cronometradas de finais diretas.',
    order_index: 14,
  },
  {
    id: 'corrida-caminhada',
    name: 'Caminhada e Corrida',
    category: 'M/F Participativa',
    type: 'individual',
    stage: 'Geral',
    format: 'participativa',
    icon: 'Footprints',
    rules_summary: 'Caráter participativo e integrativo com medalha a todos os concluintes devidamente inscritos.',
    order_index: 15,
  },
];

export const INITIAL_TEAMS: CollectiveTeam[] = [
  // Futsal Masc
  { id: 'fut-m-galaticos', name: 'Galáticos Cpla', modality_id: 'futsal-masc', group_name: 'Grupo A', initial_code: 'A1', campus_id: 'campus-planaltina', avatar_key: 'galaticos' },
  { id: 'fut-m-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'futsal-masc', group_name: 'Grupo A', initial_code: 'A2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'fut-m-gama', name: 'Gama', modality_id: 'futsal-masc', group_name: 'Grupo A', initial_code: 'A3', campus_id: 'campus-gama', avatar_key: 'gama' },
  { id: 'fut-m-sarues', name: 'Os Saruês', modality_id: 'futsal-masc', group_name: 'Grupo B', initial_code: 'B1', campus_id: 'campus-brasilia', avatar_key: 'sarues' },
  { id: 'fut-m-canela', name: 'Canela de Ema', modality_id: 'futsal-masc', group_name: 'Grupo B', initial_code: 'B2', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'fut-m-cachorroes', name: 'Cachorrões', modality_id: 'futsal-masc', group_name: 'Grupo B', initial_code: 'B3', campus_id: 'campus-taguatinga', avatar_key: 'cachorroes' },
  { id: 'fut-m-next', name: 'Next', modality_id: 'futsal-masc', group_name: 'Grupo C', initial_code: 'C1', campus_id: 'campus-samambaia', avatar_key: 'next' },
  { id: 'fut-m-deepriver', name: 'Deep River', modality_id: 'futsal-masc', group_name: 'Grupo C', initial_code: 'C2', campus_id: 'campus-riacho-fundo', avatar_key: 'deepriver' },
  { id: 'fut-m-estrutural', name: 'Campus Estrutural', modality_id: 'futsal-masc', group_name: 'Grupo C', initial_code: 'C3', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },

  // Futsal Fem
  { id: 'fut-f-gatopreto', name: 'Gato Preto', modality_id: 'futsal-fem', group_name: 'Triangular', initial_code: 'F1', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'fut-f-donas', name: 'Donas da bola', modality_id: 'futsal-fem', group_name: 'Triangular', initial_code: 'F2', campus_id: 'campus-taguatinga', avatar_key: 'donas' },
  { id: 'fut-f-sebastiana', name: 'Sebastiana F.C.', modality_id: 'futsal-fem', group_name: 'Triangular', initial_code: 'F3', campus_id: 'campus-sao-sebastiao', avatar_key: 'sebastiana' },

  // Vôlei Misto
  { id: 'vol-m-ctag', name: 'Voleibol_Ctag', modality_id: 'volei-misto', group_name: 'Grupo A', initial_code: 'A1', campus_id: 'campus-taguatinga', avatar_key: 'voleibol_ctag' },
  { id: 'vol-m-deepriver', name: 'Deep River', modality_id: 'volei-misto', group_name: 'Grupo A', initial_code: 'A2', campus_id: 'campus-riacho-fundo', avatar_key: 'deepriver' },
  { id: 'vol-m-cpla', name: 'CPLA', modality_id: 'volei-misto', group_name: 'Grupo A', initial_code: 'A3', campus_id: 'campus-planaltina', avatar_key: 'cpla' },
  { id: 'vol-m-boratime', name: 'Bora Time', modality_id: 'volei-misto', group_name: 'Grupo A', initial_code: 'A4', campus_id: 'reitoria', avatar_key: 'boratime' },
  { id: 'vol-m-canela', name: 'Canela de Ema', modality_id: 'volei-misto', group_name: 'Grupo B', initial_code: 'B1', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'vol-m-gatopreto', name: 'Gato Preto CCEI', modality_id: 'volei-misto', group_name: 'Grupo B', initial_code: 'B2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'vol-m-titas', name: 'Titãs do Vôlei', modality_id: 'volei-misto', group_name: 'Grupo B', initial_code: 'B3', campus_id: 'campus-brasilia', avatar_key: 'titas' },
  { id: 'vol-m-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'volei-misto', group_name: 'Grupo B', initial_code: 'B4', campus_id: 'campus-samambaia', avatar_key: 'semdidatica' },

  // Basquete 3x3 Masc
  { id: 'bas-m-estrutural', name: 'Estrutural', modality_id: 'basquete-masc', group_name: 'Grupo A', initial_code: 'M-A1', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },
  { id: 'bas-m-canela', name: 'Canela de Ema', modality_id: 'basquete-masc', group_name: 'Grupo A', initial_code: 'M-A2', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'bas-m-quitados', name: 'Quitados e Queimados', modality_id: 'basquete-masc', group_name: 'Grupo A', initial_code: 'M-A3', campus_id: 'reitoria', avatar_key: 'quitados' },
  { id: 'bas-m-ctag', name: 'CTAG Hoopers', modality_id: 'basquete-masc', group_name: 'Grupo B', initial_code: 'M-B1', campus_id: 'campus-taguatinga', avatar_key: 'ctaghoopers' },
  { id: 'bas-m-gatopreto', name: 'Gato Preto CCEI', modality_id: 'basquete-masc', group_name: 'Grupo B', initial_code: 'M-B2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'bas-m-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'basquete-masc', group_name: 'Grupo B', initial_code: 'M-B3', campus_id: 'campus-samambaia', avatar_key: 'semdidatica' },

  // Basquete 3x3 Misto
  { id: 'bas-x-jordana', name: 'Jordan\'as Tagua Clube', modality_id: 'basquete-misto', group_name: 'Triangular', initial_code: 'X1', campus_id: 'campus-taguatinga', avatar_key: 'jordana' },
  { id: 'bas-x-gatopreto2', name: 'Gato Preto Misto 2', modality_id: 'basquete-misto', group_name: 'Triangular', initial_code: 'X2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'bas-x-gatopreto1', name: 'Gato Preto Misto 1', modality_id: 'basquete-misto', group_name: 'Triangular', initial_code: 'X3', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },

  // Vôlei de Praia Masc
  { id: 'vpr-m-cest', name: 'CEST', modality_id: 'volei-praia-masc', group_name: 'Grupo A', initial_code: 'M-A1', campus_id: 'campus-estrutural', avatar_key: 'cest' },
  { id: 'vpr-m-estrutural', name: 'Estrutural', modality_id: 'volei-praia-masc', group_name: 'Grupo A', initial_code: 'M-A2', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },
  { id: 'vpr-m-bonde', name: 'Bonde da Ceilândia', modality_id: 'volei-praia-masc', group_name: 'Grupo A', initial_code: 'M-A3', campus_id: 'campus-ceilandia', avatar_key: 'bonde' },
  { id: 'vpr-m-sarues', name: 'Os Saruês', modality_id: 'volei-praia-masc', group_name: 'Grupo B', initial_code: 'M-B1', campus_id: 'campus-brasilia', avatar_key: 'sarues' },
  { id: 'vpr-m-cei2', name: 'IFB Ceilândia - Equipe 02', modality_id: 'volei-praia-masc', group_name: 'Grupo B', initial_code: 'M-B2', campus_id: 'campus-ceilandia', avatar_key: 'cei2' },
  { id: 'vpr-m-canela', name: 'Canela de Ema', modality_id: 'volei-praia-masc', group_name: 'Grupo B', initial_code: 'M-B3', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'vpr-m-semdidatica', name: 'Sem Didática para Jogar', modality_id: 'volei-praia-masc', group_name: 'Grupo C', initial_code: 'M-C1', campus_id: 'campus-samambaia', avatar_key: 'semdidatica' },
  { id: 'vpr-m-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'volei-praia-masc', group_name: 'Grupo C', initial_code: 'M-C2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'vpr-m-sand', name: 'Sand', modality_id: 'volei-praia-masc', group_name: 'Grupo C', initial_code: 'M-C3', campus_id: 'campus-riacho-fundo', avatar_key: 'sand' },

  // Futevôlei Masc
  { id: 'futv-m-mtbrothers', name: 'MT Brothers', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', initial_code: 'M1', campus_id: 'campus-taguatinga', avatar_key: 'mtbrothers' },
  { id: 'futv-m-canela', name: 'Canela de Ema', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', initial_code: 'M2', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'futv-m-gatopreto', name: 'Gato Preto', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', initial_code: 'M3', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'futv-m-sandstars', name: 'Sand Stars', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', initial_code: 'M4', campus_id: 'campus-riacho-fundo', avatar_key: 'sandstars' },
  { id: 'futv-m-sarues', name: 'Os Saruês', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', initial_code: 'M5', campus_id: 'campus-brasilia', avatar_key: 'sarues' },

  // Futevôlei Misto
  { id: 'futv-x-soberanas', name: 'Soberanas do Taguá Clube', modality_id: 'futevolei-misto', group_name: 'Final Direta', initial_code: 'X1', campus_id: 'campus-taguatinga', avatar_key: 'soberanas' },
  { id: 'futv-x-deepriver', name: 'Deep River', modality_id: 'futevolei-misto', group_name: 'Final Direta', initial_code: 'X2', campus_id: 'campus-riacho-fundo', avatar_key: 'deepriver' },

  // Queimada Mista
  { id: 'que-x-elite', name: 'Elite', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X1', campus_id: 'campus-brasilia', avatar_key: 'elite' },
  { id: 'que-x-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X2', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'que-x-endorfinadas', name: 'Endorfinadas IFB', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X3', campus_id: 'reitoria', avatar_key: 'endorfinadas' },
  { id: 'que-x-deepriver', name: 'Deep River', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X4', campus_id: 'campus-riacho-fundo', avatar_key: 'deepriver' },
  { id: 'que-x-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X5', campus_id: 'campus-samambaia', avatar_key: 'semdidatica' },
  { id: 'que-x-donas', name: 'Donas da Bola', modality_id: 'queimada-mista', group_name: 'Chave Única', initial_code: 'X6', campus_id: 'campus-taguatinga', avatar_key: 'donas' },

  // Handebol Misto
  { id: 'han-x-furia', name: 'Fúria Ctga', modality_id: 'handebol-misto', group_name: 'Chave Única', initial_code: 'X1', campus_id: 'campus-taguatinga', avatar_key: 'furia' },
  { id: 'han-x-deepriver', name: 'Deep River', modality_id: 'handebol-misto', group_name: 'Chave Única', initial_code: 'X2', campus_id: 'campus-riacho-fundo', avatar_key: 'deepriver' },
  { id: 'han-x-gatopreto', name: 'Gato Preto CCEI', modality_id: 'handebol-misto', group_name: 'Chave Única', initial_code: 'X3', campus_id: 'campus-ceilandia', avatar_key: 'gatopreto' },
  { id: 'han-x-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'handebol-misto', group_name: 'Chave Única', initial_code: 'X4', campus_id: 'campus-samambaia', avatar_key: 'semdidatica' },
];

export const INITIAL_MATCHES: Match[] = [
  // Futsal Masc - Grupo A
  { id: 'match-fut-1', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-galaticos', team_b_id: 'fut-m-gatopreto', team_a_name: 'Galáticos Cpla', team_b_name: 'Gato Preto - CCEI', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
  { id: 'match-fut-2', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-gatopreto', team_b_id: 'fut-m-gama', team_a_name: 'Gato Preto - CCEI', team_b_name: 'Gama', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 2 },
  { id: 'match-fut-3', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-galaticos', team_b_id: 'fut-m-gama', team_a_name: 'Galáticos Cpla', team_b_name: 'Gama', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 3 },

  // Futsal Masc - Grupo B
  { id: 'match-fut-4', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-sarues', team_b_id: 'fut-m-canela', team_a_name: 'Os Saruês', team_b_name: 'Canela de Ema', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
  { id: 'match-fut-5', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-canela', team_b_id: 'fut-m-cachorroes', team_a_name: 'Canela de Ema', team_b_name: 'Cachorrões', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 2 },
  { id: 'match-fut-6', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-sarues', team_b_id: 'fut-m-cachorroes', team_a_name: 'Os Saruês', team_b_name: 'Cachorrões', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 3 },

  // Futsal Masc - Grupo C
  { id: 'match-fut-7', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-next', team_b_id: 'fut-m-deepriver', team_a_name: 'Next', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
  { id: 'match-fut-8', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-deepriver', team_b_id: 'fut-m-estrutural', team_a_name: 'Deep River', team_b_name: 'Campus Estrutural', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 2 },
  { id: 'match-fut-9', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-next', team_b_id: 'fut-m-estrutural', team_a_name: 'Next', team_b_name: 'Campus Estrutural', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 3 },

  // Futsal Fem - Triangular
  { id: 'match-futf-1', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-gatopreto', team_b_id: 'fut-f-donas', team_a_name: 'Gato Preto', team_b_name: 'Donas da bola', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
  { id: 'match-futf-2', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-donas', team_b_id: 'fut-f-sebastiana', team_a_name: 'Donas da bola', team_b_name: 'Sebastiana F.C.', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 2 },
  { id: 'match-futf-3', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-gatopreto', team_b_id: 'fut-f-sebastiana', team_a_name: 'Gato Preto', team_b_name: 'Sebastiana F.C.', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 3 },

  // Vôlei Misto - Grupo A
  { id: 'match-vol-1', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-ctag', team_b_id: 'vol-m-deepriver', team_a_name: 'Voleibol_Ctag', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 1 },
  { id: 'match-vol-2', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-cpla', team_b_id: 'vol-m-boratime', team_a_name: 'CPLA', team_b_name: 'Bora Time', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 1 },
  { id: 'match-vol-3', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-ctag', team_b_id: 'vol-m-cpla', team_a_name: 'Voleibol_Ctag', team_b_name: 'CPLA', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 2 },
  { id: 'match-vol-4', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-deepriver', team_b_id: 'vol-m-boratime', team_a_name: 'Deep River', team_b_name: 'Bora Time', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 2 },
  { id: 'match-vol-5', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-ctag', team_b_id: 'vol-m-boratime', team_a_name: 'Voleibol_Ctag', team_b_name: 'Bora Time', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 3 },
  { id: 'match-vol-6', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-deepriver', team_b_id: 'vol-m-cpla', team_a_name: 'Deep River', team_b_name: 'CPLA', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 3 },

  // Vôlei Misto - Grupo B
  { id: 'match-vol-7', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-canela', team_b_id: 'vol-m-gatopreto', team_a_name: 'Canela de Ema', team_b_name: 'Gato Preto CCEI', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 1 },
  { id: 'match-vol-8', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-titas', team_b_id: 'vol-m-semdidatica', team_a_name: 'Titãs do Vôlei', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 1 },
  { id: 'match-vol-9', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-canela', team_b_id: 'vol-m-titas', team_a_name: 'Canela de Ema', team_b_name: 'Titãs do Vôlei', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 2 },
  { id: 'match-vol-10', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-gatopreto', team_b_id: 'vol-m-semdidatica', team_a_name: 'Gato Preto CCEI', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 2 },
  { id: 'match-vol-11', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-canela', team_b_id: 'vol-m-semdidatica', team_a_name: 'Canela de Ema', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 3 },
  { id: 'match-vol-12', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vol-m-gatopreto', team_b_id: 'vol-m-titas', team_a_name: 'Gato Preto CCEI', team_b_name: 'Titãs do Vôlei', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Coberta', round: 3 },

  // Basquete 3x3 Masc
  { id: 'match-bas-1', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-estrutural', team_b_id: 'bas-m-canela', team_a_name: 'Estrutural', team_b_name: 'Canela de Ema', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 1 },
  { id: 'match-bas-2', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-canela', team_b_id: 'bas-m-quitados', team_a_name: 'Canela de Ema', team_b_name: 'Quitados e Queimados', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 2 },
  { id: 'match-bas-3', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-estrutural', team_b_id: 'bas-m-quitados', team_a_name: 'Estrutural', team_b_name: 'Quitados e Queimados', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 3 },
  { id: 'match-bas-4', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'bas-m-ctag', team_b_id: 'bas-m-gatopreto', team_a_name: 'CTAG Hoopers', team_b_name: 'Gato Preto CCEI', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 1 },
  { id: 'match-bas-5', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'bas-m-gatopreto', team_b_id: 'bas-m-semdidatica', team_a_name: 'Gato Preto CCEI', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 2 },
  { id: 'match-bas-6', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'bas-m-ctag', team_b_id: 'bas-m-semdidatica', team_a_name: 'CTAG Hoopers', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 3 },

  // Basquete 3x3 Misto
  { id: 'match-basx-1', modality_id: 'basquete-misto', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'bas-x-jordana', team_b_id: 'bas-x-gatopreto2', team_a_name: 'Jordan\'as Tagua Clube', team_b_name: 'Gato Preto Misto 2', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 1 },
  { id: 'match-basx-2', modality_id: 'basquete-misto', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'bas-x-gatopreto2', team_b_id: 'bas-x-gatopreto1', team_a_name: 'Gato Preto Misto 2', team_b_name: 'Gato Preto Misto 1', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 2 },
  { id: 'match-basx-3', modality_id: 'basquete-misto', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'bas-x-jordana', team_b_id: 'bas-x-gatopreto1', team_a_name: 'Jordan\'as Tagua Clube', team_b_name: 'Gato Preto Misto 1', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra de Basquete', round: 3 },

  // Vôlei de Praia Masc
  { id: 'match-vpr-1', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vpr-m-cest', team_b_id: 'vpr-m-estrutural', team_a_name: 'CEST', team_b_name: 'Estrutural', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 1 },
  { id: 'match-vpr-2', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vpr-m-estrutural', team_b_id: 'vpr-m-bonde', team_a_name: 'Estrutural', team_b_name: 'Bonde da Ceilândia', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 2 },
  { id: 'match-vpr-3', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vpr-m-cest', team_b_id: 'vpr-m-bonde', team_a_name: 'CEST', team_b_name: 'Bonde da Ceilândia', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 3 },
  { id: 'match-vpr-4', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vpr-m-sarues', team_b_id: 'vpr-m-cei2', team_a_name: 'Os Saruês', team_b_name: 'IFB Ceilândia - Equipe 02', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 2', round: 1 },
  { id: 'match-vpr-5', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vpr-m-cei2', team_b_id: 'vpr-m-canela', team_a_name: 'IFB Ceilândia - Equipe 02', team_b_name: 'Canela de Ema', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 2', round: 2 },
  { id: 'match-vpr-6', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'vpr-m-sarues', team_b_id: 'vpr-m-canela', team_a_name: 'Os Saruês', team_b_name: 'Canela de Ema', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 2', round: 3 },
  { id: 'match-vpr-7', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'vpr-m-semdidatica', team_b_id: 'vpr-m-gatopreto', team_a_name: 'Sem Didática para Jogar', team_b_name: 'Gato Preto - CCEI', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 1 },
  { id: 'match-vpr-8', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'vpr-m-gatopreto', team_b_id: 'vpr-m-sand', team_a_name: 'Gato Preto - CCEI', team_b_name: 'Sand', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 2 },
  { id: 'match-vpr-9', modality_id: 'volei-praia-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'vpr-m-semdidatica', team_b_id: 'vpr-m-sand', team_a_name: 'Sem Didática para Jogar', team_b_name: 'Sand', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia 1', round: 3 },

  // Futevôlei Misto (Final Direta)
  { id: 'match-futvx-1', modality_id: 'futevolei-misto', phase: 'Final', group_name: 'Final Direta', team_a_id: 'futv-x-soberanas', team_b_id: 'futv-x-deepriver', team_a_name: 'Soberanas do Taguá Clube', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Arena de Areia Central', round: 1 },

  // Queimada Mista
  { id: 'match-que-1', modality_id: 'queimada-mista', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'que-x-elite', team_b_id: 'que-x-gatopreto', team_a_name: 'Elite', team_b_name: 'Gato Preto - CCEI', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Central', round: 1 },
  { id: 'match-que-2', modality_id: 'queimada-mista', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'que-x-endorfinadas', team_b_id: 'que-x-deepriver', team_a_name: 'Endorfinadas IFB', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Central', round: 1 },
  { id: 'match-que-3', modality_id: 'queimada-mista', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'que-x-semdidatica', team_b_id: 'que-x-donas', team_a_name: 'Sem Didática Para Jogar', team_b_name: 'Donas da Bola', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Quadra Central', round: 1 },

  // Handebol Misto
  { id: 'match-han-1', modality_id: 'handebol-misto', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'han-x-furia', team_b_id: 'han-x-deepriver', team_a_name: 'Fúria Ctga', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
  { id: 'match-han-2', modality_id: 'handebol-misto', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'han-x-gatopreto', team_b_id: 'han-x-semdidatica', team_a_name: 'Gato Preto CCEI', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: 'A definir', match_time: 'A definir', venue: 'Ginásio Poliesportivo', round: 1 },
];

export const INITIAL_REGULATIONS: Regulation[] = [
  {
    id: 1,
    section_type: 'Capítulo',
    section_number: 'I',
    title: 'Das Disposições Preliminares e dos Objetivos',
    content: 'Art. 1º Este Regulamento é o conjunto de disposições que regem as competições e tem por objetivo disciplinar a organização, as atividades e os eventos esportivos referentes aos Jogos de Integração dos Servidores do Instituto Federal de Brasília (IFB).\n\nArt. 2º Os Jogos são promovidos pela Pró-Reitoria de Gestão de Pessoas (PRGP) com o objetivo de promover a integração, a socialização, o bem-estar, o senso de pertencimento e o fortalecimento do espírito comunitário entre os servidores e colaboradores do IFB.',
    order_index: 1,
  },
  {
    id: 2,
    section_type: 'Capítulo',
    section_number: 'II',
    title: 'Das Finalidades',
    content: 'Art. 3º São finalidades dos Jogos de Integração dos Servidores do IFB:\nI – incentivar a prática regular de atividades físicas e esportivas, em consonância com a Política de Atenção à Saúde e Qualidade de Vida no Trabalho (QVT);\nII – contribuir para a promoção da saúde física e mental;\nIII – estimular a cooperação, o respeito mútuo e o espírito de equipe;\nIV – promover a integração intercampi e entre unidades da Reitoria.',
    order_index: 2,
  },
  {
    id: 3,
    section_type: 'Capítulo',
    section_number: 'VI',
    title: 'Do Cronograma e da Dinâmica dos Jogos',
    content: 'Art. 13. Os Jogos de Integração serão divididos em 2 (duas) etapas principais:\nI – Etapa "Primeiro Lance": voltada exclusivamente às modalidades de mesa e raciocínio (Damas, Tênis de Mesa e Xadrez), realizada em ambientes controlados nos campi com o objetivo de antecipar o engajamento comunitário;\nII – Etapa Geral de Integração: realizada em alusão ao Mês do Servidor Público Federal, concentrando as modalidades coletivas, de areia, quadra, natação e a corrida/caminhada.',
    order_index: 3,
  },
  {
    id: 4,
    section_type: 'Capítulo',
    section_number: 'VIII',
    title: 'Dos Sistemas de Disputa e W.O.',
    content: 'Art. 17. Os sistemas de disputa observarão fase de grupos seguida de semifinais e finais em eliminatória simples para torneios coletivos.\n\nArt. 18. O não comparecimento de equipe ou atleta individual no horário programado na tabela, tolerando-se o atraso máximo de 15 (quinze) minutos para o primeiro jogo da rodada, caracterizará W.O. (Walkover).',
    order_index: 4,
  },
  {
    id: 5,
    section_type: 'Anexo',
    section_number: 'V',
    title: 'Regras Específicas: Futsal',
    modality_id: 'futsal-masc',
    content: '1. Inscrição: Mínimo de 5 atletas por equipe. Em quadra: 5 atletas (1 goleiro e 4 de linha).\n2. Tempo de Jogo: 2 tempos de 15 minutos corridos (cronômetro trava nos 2 minutos finais do segundo tempo).\n3. Sistema de Pontuação na Fase de Grupos:\n- Vitória no tempo regulamentar: 3 pontos.\n- Empate: cada equipe recebe 1 ponto, sendo obrigatória a disputa de pênaltis.\n- Vitória nos pênaltis: +1 ponto adicional (totalizando 2 pontos).\n4. Playoff de 2ºs Colocados: O 2º e 3º melhores segundos jogam o Playoff Preliminar. O vencedor enfrenta o 1º melhor segundo pela 4ª vaga da Semifinal.',
    order_index: 5,
  },
  {
    id: 6,
    section_type: 'Anexo',
    section_number: 'XI',
    title: 'Regras Específicas: Vôlei (Quadra Misto)',
    modality_id: 'volei-misto',
    content: '1. Composição: Misto com presença obrigatória de 6 atletas em quadra sendo no mínimo 2 mulheres durante toda a partida.\n2. Pontuação: Partida disputada em melhor de 3 sets (dois primeiros até 25 pontos e tie-break até 15 pontos, com vantagem mínima de 2 pontos).\n3. Sistema de Disputa: 2 grupos de 4 equipes. Classificam-se as 2 melhores de cada grupo para Semifinais cruzadas (1ºA x 2ºB e 1ºB x 2ºA), disputa de 3º lugar e Final.',
    order_index: 6,
  },
  {
    id: 7,
    section_type: 'Anexo',
    section_number: 'IX',
    title: 'Regras Específicas: Queimada (Mista)',
    modality_id: 'queimada-mista',
    content: '1. Composição: 8 atletas titulares em quadra com no mínimo 3 mulheres.\n2. Tempo de Jogo: 15 minutos corridos. Vence quem queimar todos ou tiver mais atletas ativos.\n3. Cemitério e Retorno: Inicia com 1 atleta no cemitério (pivô). O atleta no cemitério que queimar um adversário no primeiro arremesso tem o direito de retornar à quadra principal.\n4. Disputa: Chave única de 6 equipes, classificando as 4 melhores para Semifinais (1ºx4º e 2ºx3º), 3º lugar e Final.',
    order_index: 7,
  },
  {
    id: 8,
    section_type: 'Anexo',
    section_number: 'VII',
    title: 'Regras Específicas: Handebol (Misto Adaptado)',
    modality_id: 'handebol-misto',
    content: '1. Composição: 7 jogadores (1 goleiro e 6 atletas de linha: 3 homens e 3 mulheres).\n2. Dinâmica Adaptada de Meia-Quadra: 3 mulheres atacando e 3 defendendo em uma metade, e 3 homens na outra metade. Proibido cruzar o meio de quadra nos primeiros 10 minutos.\n3. Troca aos 5 minutos de função (ataque x defesa). A partir da terceira troca, a linha divisória é liberada para jogo livre.',
    order_index: 8,
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Boas-vindas aos Jogos de Integração JIS-IFB 2026!',
    content: 'A PRGP e a Comissão Organizadora dão as boas-vindas a todos os servidores, estagiários e colaboradores participantes. Consulte os regulamentos e cronogramas.',
    category: 'Geral',
    published_at: '2026-10-30T10:00:00Z',
  },
  {
    id: 'notice-2',
    title: 'Abertura da Etapa "Primeiro Lance"',
    content: 'As disputas de Damas, Tênis de Mesa e Xadrez iniciarão nos campi em ambientes controlados. Confira a tabela de rodadas.',
    category: 'Técnico',
    published_at: '2026-10-30T11:00:00Z',
  },
];

