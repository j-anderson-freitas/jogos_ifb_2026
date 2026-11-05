import { Campus, Modality, CollectiveTeam, Match, Regulation, Notice, DistanceRecord, IndividualParticipant, IndividualPodium } from '../types/database';
import fullRegulations from './fullRegulations.json';

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
    format: 'grupos_4',
    icon: 'Sun',
    rules_summary: '4 grupos (Grupos A, B e C com 3 duplas, Grupo D com 2 duplas). O 1º colocado de cada um dos 4 grupos avança diretamente para as Semifinais.',
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
    rules_summary: 'Fase de grupos em turno único (chaves de 4) + Semifinais cruzadas, disputa de 3º lugar e Final.',
    order_index: 12,
  },
  {
    id: 'tenis-mesa-masc',
    name: 'Tênis de Mesa',
    category: 'Masc e Fem',
    type: 'individual',
    stage: 'Primeiro Lance',
    format: 'grupos_eliminatoria',
    icon: 'CircleDot',
    rules_summary: 'Fase de grupos em turno único + Chave eliminatória simples com disputa de bronze.',
    order_index: 13,
  },
  {
    id: 'natacao',
    name: 'Natação (25m, 50m, 100m)',
    category: 'Fem e Absoluto',
    type: 'individual',
    stage: 'Geral',
    format: 'cronometrado',
    icon: 'Waves',
    rules_summary: 'Finais diretas cronometradas (25m, 50m e 100m Livre). Pódio ordenado pelos menores tempos apurados.',
    order_index: 14,
  },
  {
    id: 'corrida-caminhada',
    name: 'Caminhada e Corrida de Rua',
    category: 'M/F Participativa',
    type: 'individual',
    stage: 'Geral',
    format: 'participativa',
    icon: 'Footprints',
    rules_summary: 'Caráter integrativo com contabilização oficial da distância percorrida por servidor e campus para o ranking de quilometragem.',
    order_index: 15,
  },
];

export const INITIAL_TEAMS: CollectiveTeam[] = [
  // Futsal Masc
  { id: 'fut-m-galaticos', name: 'Galáticos Cpla', modality_id: 'futsal-masc', group_name: 'Grupo A', campus_id: 'campus-planaltina', avatar_key: 'galaticos' },
  { id: 'fut-m-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'futsal-masc', group_name: 'Grupo A', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'fut-m-gama', name: 'Gama', modality_id: 'futsal-masc', group_name: 'Grupo A', campus_id: 'campus-gama', avatar_key: 'gama' },
  { id: 'fut-m-sarues', name: 'Os Saruês', modality_id: 'futsal-masc', group_name: 'Grupo B', campus_id: 'campus-brasilia', avatar_key: 'sarues' },
  { id: 'fut-m-canela', name: 'Canela de Ema', modality_id: 'futsal-masc', group_name: 'Grupo B', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'fut-m-cachorroes', name: 'Cachorrões', modality_id: 'futsal-masc', group_name: 'Grupo B', campus_id: 'campus-taguatinga', avatar_key: 'cachorroes' },
  { id: 'fut-m-next', name: 'Next', modality_id: 'futsal-masc', group_name: 'Grupo C', campus_id: 'campus-samambaia', avatar_key: 'next' },
  { id: 'fut-m-deepriver', name: 'Deep River', modality_id: 'futsal-masc', group_name: 'Grupo C', campus_id: 'campus-riacho-fundo', avatar_key: 'deep_river' },
  { id: 'fut-m-estrutural', name: 'Campus Estrutural', modality_id: 'futsal-masc', group_name: 'Grupo C', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },

  // Futsal Fem (Triangular)
  { id: 'fut-f-gatopreto', name: 'Gato Preto', modality_id: 'futsal-fem', group_name: 'Triangular', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'fut-f-donas', name: 'Donas da bola', modality_id: 'futsal-fem', group_name: 'Triangular', campus_id: 'campus-taguatinga', avatar_key: 'donas' },
  { id: 'fut-f-sebastiana', name: 'Sebastiana F.C.', modality_id: 'futsal-fem', group_name: 'Triangular', campus_id: 'campus-sao-sebastiao', avatar_key: 'sebastiana' },

  // Vôlei Misto - Grupo A
  { id: 'vol-m-ctag', name: 'Voleibol_Ctag', modality_id: 'volei-misto', group_name: 'Grupo A', campus_id: 'campus-taguatinga', avatar_key: 'tagua_vol' },
  { id: 'vol-m-deepriver', name: 'Deep River', modality_id: 'volei-misto', group_name: 'Grupo A', campus_id: 'campus-riacho-fundo', avatar_key: 'deep_river' },
  { id: 'vol-m-cpla', name: 'CPLA', modality_id: 'volei-misto', group_name: 'Grupo A', campus_id: 'campus-planaltina', avatar_key: 'cpla' },
  { id: 'vol-m-boratime', name: 'Bora Time', modality_id: 'volei-misto', group_name: 'Grupo A', campus_id: 'campus-brasilia', avatar_key: 'bora_time' },

  // Vôlei Misto - Grupo B
  { id: 'vol-m-canela', name: 'Canela de Ema', modality_id: 'volei-misto', group_name: 'Grupo B', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'vol-m-gatopreto', name: 'Gato Preto CCEI', modality_id: 'volei-misto', group_name: 'Grupo B', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'vol-m-titas', name: 'Titãs do Vôlei', modality_id: 'volei-misto', group_name: 'Grupo B', campus_id: 'campus-samambaia', avatar_key: 'titas' },
  { id: 'vol-m-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'volei-misto', group_name: 'Grupo B', campus_id: 'reitoria', avatar_key: 'sem_didatica' },

  // Basquete 3x3 Masc
  { id: 'bas-m-estrutural', name: 'Estrutural', modality_id: 'basquete-masc', group_name: 'Grupo A', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },
  { id: 'bas-m-canela', name: 'Canela de Ema', modality_id: 'basquete-masc', group_name: 'Grupo A', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'bas-m-quitados', name: 'Quitados e Queimados', modality_id: 'basquete-masc', group_name: 'Grupo A', campus_id: 'campus-brasilia', avatar_key: 'quitados' },
  { id: 'bas-m-ctag', name: 'CTAG Hoopers', modality_id: 'basquete-masc', group_name: 'Grupo B', campus_id: 'campus-taguatinga', avatar_key: 'tagua_vol' },
  { id: 'bas-m-gatopreto', name: 'Gato Preto CCEI', modality_id: 'basquete-masc', group_name: 'Grupo B', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'bas-m-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'basquete-masc', group_name: 'Grupo B', campus_id: 'reitoria', avatar_key: 'sem_didatica' },

  // Basquete 3x3 Misto
  { id: 'bas-x-jordana', name: 'Jordan\'as Tagua Clube', modality_id: 'basquete-misto', group_name: 'Triangular', campus_id: 'campus-taguatinga', avatar_key: 'jordana' },
  { id: 'bas-x-gatopreto2', name: 'Gato Preto Misto 2', modality_id: 'basquete-misto', group_name: 'Triangular', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'bas-x-gatopreto1', name: 'Gato Preto Misto 1', modality_id: 'basquete-misto', group_name: 'Triangular', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },

  // Vôlei de Praia Masc
  { id: 'vpr-m-cest', name: 'CEST', modality_id: 'volei-praia-masc', group_name: 'Grupo A', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },
  { id: 'vpr-m-estrutural', name: 'Estrutural', modality_id: 'volei-praia-masc', group_name: 'Grupo A', campus_id: 'campus-estrutural', avatar_key: 'estrutural' },
  { id: 'vpr-m-bonde', name: 'Bonde da Ceilândia', modality_id: 'volei-praia-masc', group_name: 'Grupo A', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'vpr-m-sarues', name: 'Os Saruês', modality_id: 'volei-praia-masc', group_name: 'Grupo B', campus_id: 'campus-brasilia', avatar_key: 'sarues' },
  { id: 'vpr-m-cei2', name: 'IFB Ceilândia - Equipe 02', modality_id: 'volei-praia-masc', group_name: 'Grupo B', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'vpr-m-canela', name: 'Canela de Ema', modality_id: 'volei-praia-masc', group_name: 'Grupo B', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'vpr-m-semdidatica', name: 'Sem Didática para Jogar', modality_id: 'volei-praia-masc', group_name: 'Grupo C', campus_id: 'reitoria', avatar_key: 'sem_didatica' },
  { id: 'vpr-m-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'volei-praia-masc', group_name: 'Grupo C', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'vpr-m-sand', name: 'Sand', modality_id: 'volei-praia-masc', group_name: 'Grupo C', campus_id: 'campus-taguatinga', avatar_key: 'sand' },
  { id: 'vpr-m-gama', name: 'Gama Areia', modality_id: 'volei-praia-masc', group_name: 'Grupo D', campus_id: 'campus-gama', avatar_key: 'gama' },
  { id: 'vpr-m-planaltina', name: 'Planaltina Beach', modality_id: 'volei-praia-masc', group_name: 'Grupo D', campus_id: 'campus-planaltina', avatar_key: 'galaticos' },

  // Futevôlei Masc
  { id: 'futv-m-mt', name: 'MT Brothers', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', campus_id: 'campus-taguatinga', avatar_key: 'sand' },
  { id: 'futv-m-canela', name: 'Canela de Ema', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', campus_id: 'campus-estrutural', avatar_key: 'canela' },
  { id: 'futv-m-gatopreto', name: 'Gato Preto', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'futv-m-sandstars', name: 'Sand Stars', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', campus_id: 'campus-brasilia', avatar_key: 'sand' },
  { id: 'futv-m-sarues', name: 'Os Saruês', modality_id: 'futevolei-masc', group_name: 'Pontos Corridos', campus_id: 'campus-brasilia', avatar_key: 'sarues' },

  // Futevôlei Misto (Confronto Direto)
  { id: 'futv-x-soberanas', name: 'Soberanas do Taguá Clube', modality_id: 'futevolei-misto', group_name: 'Final Direta', campus_id: 'campus-taguatinga', avatar_key: 'jordana' },
  { id: 'futv-x-deepriver', name: 'Deep River', modality_id: 'futevolei-misto', group_name: 'Final Direta', campus_id: 'campus-riacho-fundo', avatar_key: 'deep_river' },

  // Queimada Mista
  { id: 'que-x-elite', name: 'Elite', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'campus-brasilia', avatar_key: 'bora_time' },
  { id: 'que-x-gatopreto', name: 'Gato Preto - CCEI', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'que-x-endorfinadas', name: 'Endorfinadas IFB', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'campus-taguatinga', avatar_key: 'donas' },
  { id: 'que-x-deepriver', name: 'Deep River', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'campus-riacho-fundo', avatar_key: 'deep_river' },
  { id: 'que-x-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'reitoria', avatar_key: 'sem_didatica' },
  { id: 'que-x-donas', name: 'Donas da Bola', modality_id: 'queimada-mista', group_name: 'Chave Única', campus_id: 'campus-taguatinga', avatar_key: 'donas' },

  // Handebol Misto
  { id: 'han-x-furia', name: 'Fúria Ctga', modality_id: 'handebol-misto', group_name: 'Chave Única', campus_id: 'campus-taguatinga', avatar_key: 'furia' },
  { id: 'han-x-deepriver', name: 'Deep River', modality_id: 'handebol-misto', group_name: 'Chave Única', campus_id: 'campus-riacho-fundo', avatar_key: 'deep_river' },
  { id: 'han-x-gatopreto', name: 'Gato Preto CCEI', modality_id: 'handebol-misto', group_name: 'Chave Única', campus_id: 'campus-ceilandia', avatar_key: 'gato_preto' },
  { id: 'han-x-semdidatica', name: 'Sem Didática Para Jogar', modality_id: 'handebol-misto', group_name: 'Chave Única', campus_id: 'reitoria', avatar_key: 'sem_didatica' },
];

export const INITIAL_MATCHES: Match[] = [
  // Futsal Masc - Grupo A
  { id: 'match-fut-1', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-galaticos', team_b_id: 'fut-m-gatopreto', team_a_name: 'Galáticos Cpla', team_b_name: 'Gato Preto - CCEI', score_a: 4, score_b: 2, status: 'Finalizado', match_date: '10/11/2026', match_time: '09:00', venue: 'Campus Planaltina', round: 1 },
  { id: 'match-fut-2', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-gatopreto', team_b_id: 'fut-m-gama', team_a_name: 'Gato Preto - CCEI', team_b_name: 'Gama', score_a: 3, score_b: 3, score_penalties_a: 3, score_penalties_b: 2, status: 'Finalizado', match_date: '10/11/2026', match_time: '10:30', venue: 'Campus Planaltina', round: 2 },
  { id: 'match-fut-3', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'fut-m-galaticos', team_b_id: 'fut-m-gama', team_a_name: 'Galáticos Cpla', team_b_name: 'Gama', score_a: 2, score_b: 1, status: 'Ao Vivo', match_date: '11/11/2026', match_time: '14:00', venue: 'Campus Planaltina', round: 3 },

  // Futsal Masc - Grupo B
  { id: 'match-fut-4', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-sarues', team_b_id: 'fut-m-canela', team_a_name: 'Os Saruês', team_b_name: 'Canela de Ema', score_a: 0, score_b: 0, status: 'Agendado', match_date: '11/11/2026', match_time: '15:30', venue: 'Campus Brasília', round: 1 },
  { id: 'match-fut-5', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-canela', team_b_id: 'fut-m-cachorroes', team_a_name: 'Canela de Ema', team_b_name: 'Cachorrões', score_a: 0, score_b: 0, status: 'Agendado', match_date: '12/11/2026', match_time: '09:00', venue: 'Campus Brasília', round: 2 },
  { id: 'match-fut-6', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo B', team_a_id: 'fut-m-sarues', team_b_id: 'fut-m-cachorroes', team_a_name: 'Os Saruês', team_b_name: 'Cachorrões', score_a: 0, score_b: 0, status: 'Agendado', match_date: '12/11/2026', match_time: '10:30', venue: 'Campus Brasília', round: 3 },

  // Futsal Masc - Grupo C
  { id: 'match-fut-7', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-next', team_b_id: 'fut-m-deepriver', team_a_name: 'Next', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: '12/11/2026', match_time: '14:00', venue: 'Campus Samambaia', round: 1 },
  { id: 'match-fut-8', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-deepriver', team_b_id: 'fut-m-estrutural', team_a_name: 'Deep River', team_b_name: 'Campus Estrutural', score_a: 0, score_b: 0, status: 'Agendado', match_date: '13/11/2026', match_time: '09:00', venue: 'Campus Samambaia', round: 2 },
  { id: 'match-fut-9', modality_id: 'futsal-masc', phase: 'Fase de Grupos', group_name: 'Grupo C', team_a_id: 'fut-m-next', team_b_id: 'fut-m-estrutural', team_a_name: 'Next', team_b_name: 'Campus Estrutural', score_a: 0, score_b: 0, status: 'Agendado', match_date: '13/11/2026', match_time: '10:30', venue: 'Campus Samambaia', round: 3 },

  // Futsal Fem - Triangular
  { id: 'match-futf-1', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-gatopreto', team_b_id: 'fut-f-donas', team_a_name: 'Gato Preto', team_b_name: 'Donas da bola', score_a: 3, score_b: 1, status: 'Finalizado', match_date: '10/11/2026', match_time: '14:00', venue: 'Campus Ceilândia', round: 1 },
  { id: 'match-futf-2', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-donas', team_b_id: 'fut-f-sebastiana', team_a_name: 'Donas da bola', team_b_name: 'Sebastiana F.C.', score_a: 0, score_b: 0, status: 'Agendado', match_date: '11/11/2026', match_time: '16:00', venue: 'Campus Ceilândia', round: 2 },
  { id: 'match-futf-3', modality_id: 'futsal-fem', phase: 'Fase de Grupos', group_name: 'Triangular', team_a_id: 'fut-f-gatopreto', team_b_id: 'fut-f-sebastiana', team_a_name: 'Gato Preto', team_b_name: 'Sebastiana F.C.', score_a: 0, score_b: 0, status: 'Agendado', match_date: '12/11/2026', match_time: '16:00', venue: 'Campus Ceilândia', round: 3 },

  // Vôlei Misto - Grupo A
  { id: 'match-vol-1', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-ctag', team_b_id: 'vol-m-deepriver', team_a_name: 'Voleibol_Ctag', team_b_name: 'Deep River', score_a: 2, score_b: 0, sets_detail: '25x21, 25x18', status: 'Finalizado', match_date: '10/11/2026', match_time: '10:00', venue: 'Campus Taguatinga', round: 1 },
  { id: 'match-vol-2', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-cpla', team_b_id: 'vol-m-boratime', team_a_name: 'CPLA', team_b_name: 'Bora Time', score_a: 1, score_b: 2, sets_detail: '22x25, 25x23, 12x15', status: 'Finalizado', match_date: '10/11/2026', match_time: '11:30', venue: 'Campus Taguatinga', round: 1 },
  { id: 'match-vol-3', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-ctag', team_b_id: 'vol-m-cpla', team_a_name: 'Voleibol_Ctag', team_b_name: 'CPLA', score_a: 1, score_b: 1, sets_detail: 'Em andamento (1x1)', status: 'Ao Vivo', match_date: '11/11/2026', match_time: '10:00', venue: 'Campus Taguatinga', round: 2 },
  { id: 'match-vol-4', modality_id: 'volei-misto', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'vol-m-deepriver', team_b_id: 'vol-m-boratime', team_a_name: 'Deep River', team_b_name: 'Bora Time', score_a: 0, score_b: 0, status: 'Agendado', match_date: '11/11/2026', match_time: '11:30', venue: 'Campus Taguatinga', round: 2 },

  // Basquete 3x3 Masc
  { id: 'match-bas-1', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-estrutural', team_b_id: 'bas-m-canela', team_a_name: 'Estrutural', team_b_name: 'Canela de Ema', score_a: 21, score_b: 15, status: 'Finalizado', match_date: '10/11/2026', match_time: '14:30', venue: 'Campus Estrutural', round: 1 },
  { id: 'match-bas-2', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-canela', team_b_id: 'bas-m-quitados', team_a_name: 'Canela de Ema', team_b_name: 'Quitados e Queimados', score_a: 0, score_b: 0, status: 'Agendado', match_date: '11/11/2026', match_time: '14:30', venue: 'Campus Estrutural', round: 2 },
  { id: 'match-bas-3', modality_id: 'basquete-masc', phase: 'Fase de Grupos', group_name: 'Grupo A', team_a_id: 'bas-m-estrutural', team_b_id: 'bas-m-quitados', team_a_name: 'Estrutural', team_b_name: 'Quitados e Queimados', score_a: 0, score_b: 0, status: 'Agendado', match_date: '12/11/2026', match_time: '14:30', venue: 'Campus Estrutural', round: 3 },

  // Futevôlei Misto (Final Direta)
  { id: 'match-futvx-1', modality_id: 'futevolei-misto', phase: 'Final', group_name: 'Final Direta', team_a_id: 'futv-x-soberanas', team_b_id: 'futv-x-deepriver', team_a_name: 'Soberanas do Taguá Clube', team_b_name: 'Deep River', score_a: 0, score_b: 0, status: 'Agendado', match_date: '14/11/2026', match_time: '16:00', venue: 'Campus Taguatinga', round: 1 },

  // Handebol Misto
  { id: 'match-han-1', modality_id: 'handebol-misto', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'han-x-furia', team_b_id: 'han-x-deepriver', team_a_name: 'Fúria Ctga', team_b_name: 'Deep River', score_a: 14, score_b: 10, status: 'Finalizado', match_date: '10/11/2026', match_time: '16:00', venue: 'Campus Taguatinga', round: 1 },
  { id: 'match-han-2', modality_id: 'handebol-misto', phase: 'Fase de Grupos', group_name: 'Chave Única', team_a_id: 'han-x-gatopreto', team_b_id: 'han-x-semdidatica', team_a_name: 'Gato Preto CCEI', team_b_name: 'Sem Didática Para Jogar', score_a: 0, score_b: 0, status: 'Agendado', match_date: '11/11/2026', match_time: '16:30', venue: 'Campus Taguatinga', round: 1 },
];

export const INITIAL_REGULATIONS: Regulation[] = fullRegulations as Regulation[];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Abertura Oficial dos Jogos JIS-IFB 2026',
    summary: 'Cerimônia magna de abertura reúne atletas de todos os 10 Campi e Reitoria em celebração esportiva.',
    content: 'A Pró-Reitoria de Gestão de Pessoas (PRGP) e a Comissão Organizadora dão início oficial aos Jogos de Integração dos Servidores do IFB 2026. Venha prestigiar as equipes, apoiar seus colegas e viver o espírito de união e bem-estar que marca a nossa instituição.',
    category: 'Destaque',
    image_url: '/images/logo-jis.png',
    author: 'Comissão Organizadora PRGP',
    published_at: '2026-11-04T08:00:00Z',
    pinned: true,
  },
  {
    id: 'notice-2',
    title: 'Primeiro Lance: Início dos Torneios de Xadrez e Tênis de Mesa',
    summary: 'Etapa inicial reúne enxadristas e mesa-tenistas nos Campi sede com partidas acirradas.',
    content: 'As disputas das modalidades individuais começaram com grande entusiasmo. O sistema suíço de xadrez e as chaves de grupos do tênis de mesa já estão disponíveis para consulta no portal oficial.',
    category: 'Técnico',
    image_url: '/images/logo-jis.png',
    author: 'Subcomissão de Esportes Individuais',
    published_at: '2026-11-04T10:30:00Z',
    pinned: false,
  },
  {
    id: 'notice-3',
    title: 'Orientações para o Desafio da Corrida e Caminhada',
    summary: 'Saiba como registrar suas distâncias percorridas e somar pontos preciosos para o seu Campus.',
    content: 'A corrida e caminhada dos servidores segue em ritmo forte! Os registros de distância devem ser enviados à comissão técnica de cada unidade para inserção na planilha oficial de quilometragem acumulada.',
    category: 'Geral',
    image_url: '/images/logo-jis.png',
    author: 'Diretoria de Qualidade de Vida (DRDP)',
    published_at: '2026-11-04T12:00:00Z',
    pinned: false,
  },
];

export const INITIAL_PARTICIPANTS: IndividualParticipant[] = [
  { id: 'part-1', name: 'Carlos Eduardo Mendes', campus_id: 'campus-brasilia', modality_id: 'corrida-caminhada', event_category: 'Servidor', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-2', name: 'Juliana Costa Ferreira', campus_id: 'campus-taguatinga', modality_id: 'corrida-caminhada', event_category: 'Servidora', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-3', name: 'Marcos Vinícius Silva', campus_id: 'campus-planaltina', modality_id: 'corrida-caminhada', event_category: 'Servidor', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-4', name: 'Patrícia Albuquerque', campus_id: 'campus-ceilandia', modality_id: 'corrida-caminhada', event_category: 'Servidora', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-5', name: 'Fernando Rocha Lima', campus_id: 'campus-estrutural', modality_id: 'corrida-caminhada', event_category: 'Servidor', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-6', name: 'Beatriz Nogueira', campus_id: 'reitoria', modality_id: 'corrida-caminhada', event_category: 'Servidora', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-7', name: 'Lucas Guimarães', campus_id: 'campus-gama', modality_id: 'corrida-caminhada', event_category: 'Servidor', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-8', name: 'Renata Vasconcelos', campus_id: 'campus-samambaia', modality_id: 'corrida-caminhada', event_category: 'Servidora', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-9', name: 'Prof. Alexandre Santos', campus_id: 'campus-brasilia', modality_id: 'xadrez-aberto', event_category: 'Aberto', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-10', name: 'Profa. Mariana Costa', campus_id: 'campus-taguatinga', modality_id: 'xadrez-aberto', event_category: 'Aberto', created_at: '2026-11-04T10:00:00Z' },
  { id: 'part-11', name: 'Rodrigo Medeiros', campus_id: 'campus-ceilandia', modality_id: 'tenis-mesa-individual', event_category: 'Geral', created_at: '2026-11-04T10:00:00Z' },
];

export const INITIAL_PODIUMS: IndividualPodium[] = [
  { id: 'pod-1', modality_id: 'xadrez-aberto', event_category: 'Aberto', position: 1, participant_name: 'Prof. Alexandre Santos', campus_id: 'campus-brasilia', created_at: '2026-11-04T12:00:00Z' },
  { id: 'pod-2', modality_id: 'xadrez-aberto', event_category: 'Aberto', position: 2, participant_name: 'Profa. Mariana Costa', campus_id: 'campus-taguatinga', created_at: '2026-11-04T12:00:00Z' },
];

export const INITIAL_DISTANCES: DistanceRecord[] = [
  { id: 'dist-1', participant_name: 'Carlos Eduardo Mendes', campus_id: 'campus-brasilia', distance_km: 18.5, date: '10/11/2026', category: 'Servidor', created_at: '2026-11-04T10:00:00Z' },
  { id: 'dist-2', participant_name: 'Juliana Costa Ferreira', campus_id: 'campus-taguatinga', distance_km: 16.2, date: '10/11/2026', category: 'Servidora', created_at: '2026-11-04T10:30:00Z' },
  { id: 'dist-3', participant_name: 'Marcos Vinícius Silva', campus_id: 'campus-planaltina', distance_km: 15.0, date: '11/11/2026', category: 'Servidor', created_at: '2026-11-04T11:00:00Z' },
  { id: 'dist-4', participant_name: 'Patrícia Albuquerque', campus_id: 'campus-ceilandia', distance_km: 14.8, date: '11/11/2026', category: 'Servidora', created_at: '2026-11-04T11:30:00Z' },
  { id: 'dist-5', participant_name: 'Fernando Rocha Lima', campus_id: 'campus-estrutural', distance_km: 12.4, date: '12/11/2026', category: 'Servidor', created_at: '2026-11-04T12:00:00Z' },
  { id: 'dist-6', participant_name: 'Beatriz Nogueira', campus_id: 'reitoria', distance_km: 11.7, date: '12/11/2026', category: 'Servidora', created_at: '2026-11-04T12:30:00Z' },
  { id: 'dist-7', participant_name: 'Lucas Guimarães', campus_id: 'campus-gama', distance_km: 10.5, date: '13/11/2026', category: 'Servidor', created_at: '2026-11-04T13:00:00Z' },
  { id: 'dist-8', participant_name: 'Renata Vasconcelos', campus_id: 'campus-samambaia', distance_km: 9.8, date: '13/11/2026', category: 'Servidora', created_at: '2026-11-04T13:30:00Z' },
];
