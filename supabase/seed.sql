-- ====================================================================
-- JIS-IFB 2026: SUPABASE POSTGRESQL SEED DATA
-- Carga Inicial das Modalidades, Equipes, Confrontos e Regulamento
-- ====================================================================

-- 1. Inserção dos 10 Campi e Reitoria do IFB
INSERT INTO campuses (id, name, short_name, city) VALUES
  ('campus-brasilia', 'Campus Brasília', 'Brasília', 'Brasília - DF'),
  ('campus-taguatinga', 'Campus Taguatinga', 'Taguatinga', 'Taguatinga - DF'),
  ('campus-ceilandia', 'Campus Ceilândia', 'Ceilândia', 'Ceilândia - DF'),
  ('campus-gama', 'Campus Gama', 'Gama', 'Gama - DF'),
  ('campus-planaltina', 'Campus Planaltina', 'Planaltina', 'Planaltina - DF'),
  ('campus-estrutural', 'Campus Estrutural', 'Estrutural', 'Estrutural - DF'),
  ('campus-riacho-fundo', 'Campus Riacho Fundo', 'Riacho Fundo', 'Riacho Fundo - DF'),
  ('campus-samambaia', 'Campus Samambaia', 'Samambaia', 'Samambaia - DF'),
  ('campus-sao-sebastiao', 'Campus São Sebastião', 'São Sebastião', 'São Sebastião - DF'),
  ('campus-recanto-emas', 'Campus Recanto das Emas', 'Recanto das Emas', 'Recanto das Emas - DF'),
  ('reitoria', 'Reitoria IFB', 'Reitoria', 'Brasília - DF')
ON CONFLICT (id) DO NOTHING;

-- 2. Inserção das Modalidades Esportivas
INSERT INTO modalities (id, name, category, type, stage, format, icon, rules_summary, order_index) VALUES
  ('futsal-masc', 'Futsal', 'Masculino', 'coletiva', 'Geral', 'grupos_3', 'Flame', '3 grupos de 3. Avançam 1ºs de cada grupo + vencedor do playoff preliminar dos 2ºs para as Semifinais.', 1),
  ('futsal-fem', 'Futsal', 'Feminino', 'coletiva', 'Geral', 'triangular', 'Trophy', 'Triangular (pontos corridos). Vitória 3 pts, empate com pênalti 2 pts, empate sem pênalti 1 pt.', 2),
  ('volei-misto', 'Vôlei de Quadra', 'Misto', 'coletiva', 'Geral', 'grupos_4', 'Activity', '2 grupos de 4. Melhor de 3 sets (25/15 pts). Semifinais cruzadas (1ºA x 2ºB, 1ºB x 2ºA), 3º e Final.', 3),
  ('basquete-masc', 'Basquete 3x3', 'Masculino', 'coletiva', 'Geral', 'grupos_3', 'Award', '2 grupos de 3. 10 minutos ou 21 pontos. Semifinais (1ºA x 2ºB, 1ºB x 2ºA) e Final.', 4),
  ('basquete-misto', 'Basquete 3x3', 'Misto', 'coletiva', 'Geral', 'triangular', 'Award', 'Triangular em turno único. Pontuação define o campeão.', 5),
  ('volei-praia-masc', 'Vôlei de Praia', 'Masculino', 'coletiva', 'Geral', 'grupos_4', 'Sun', '4 grupos (Grupos A, B e C com 3 duplas, Grupo D com 2 duplas). O 1º colocado de cada um dos 4 grupos avança diretamente para as Semifinais.', 6),
  ('futevolei-masc', 'Futevôlei', 'Masculino', 'coletiva', 'Geral', 'pontos_corridos', 'Disc', '5 duplas em pontos corridos (turno único). Set único de 18 pontos com vantagem de 2.', 7),
  ('futevolei-misto', 'Futevôlei', 'Misto', 'coletiva', 'Geral', 'confronto_direto', 'Disc', 'Confronto direto em melhor de 3 sets de 12 pontos.', 8),
  ('queimada-mista', 'Queimada', 'Mista', 'coletiva', 'Geral', 'chave_unica', 'Target', 'Chave única com 6 equipes em turno único. 4 melhores avançam para Semifinais (1ºx4º, 2ºx3º), 3º e Final.', 9),
  ('handebol-misto', 'Handebol Adaptado', 'Misto', 'coletiva', 'Geral', 'chave_unica', 'Zap', 'Chave única com 4 equipes. Regras adaptadas por tempo. Semifinais (1ºx4º, 2ºx3º), 3º e Final.', 10),
  ('xadrez-aberto', 'Xadrez', 'Aberto', 'individual', 'Primeiro Lance', 'suico', 'Compass', 'Sistema Suíço em 5 rodadas com controle de tempo rápido (10 a 15 min).', 11),
  ('damas-aberto', 'Damas', 'Aberto', 'individual', 'Primeiro Lance', 'grupos_eliminatoria', 'Layers', 'Chaves de 4 em turno único, seguidas de Semifinais e Final.', 12),
  ('tenis-mesa-geral', 'Tênis de Mesa', 'Fem e Absoluto', 'individual', 'Primeiro Lance', 'grupos_eliminatoria', 'CircleDot', 'Categorias Feminina e Absoluta em grupos + mata-mata (melhor de 3 ou 5 sets de 11 pts).', 13),
  ('natacao-geral', 'Natação', 'Masc e Fem', 'individual', 'Geral', 'cronometrado', 'Droplets', 'Provas de 25m, 50m e 100m Livre em séries cronometradas diretas.', 14),
  ('corrida-caminhada', 'Caminhada e Corrida', 'M/F Participativa', 'individual', 'Geral', 'participativa', 'Footprints', 'Caráter participativo de integração. Medalha a todos os concluintes.', 15)
ON CONFLICT (id) DO NOTHING;

-- 3. Inserção das 26 Equipes Coletivas
INSERT INTO collective_teams (id, name, modality_id, group_name, initial_code, campus_id, avatar_key) VALUES
  -- Futsal Masculino (3 grupos de 3)
  ('fut-m-galaticos', 'Galáticos Cpla', 'futsal-masc', 'Grupo A', 'A1', 'campus-planaltina', 'galaticos'),
  ('fut-m-gatopreto', 'Gato Preto - CCEI', 'futsal-masc', 'Grupo A', 'A2', 'campus-ceilandia', 'gatopreto'),
  ('fut-m-gama', 'Gama', 'futsal-masc', 'Grupo A', 'A3', 'campus-gama', 'gama'),
  ('fut-m-sarues', 'Os Saruês', 'futsal-masc', 'Grupo B', 'B1', 'campus-brasilia', 'sarues'),
  ('fut-m-canela', 'Canela de Ema', 'futsal-masc', 'Grupo B', 'B2', 'campus-estrutural', 'canela'),
  ('fut-m-cachorroes', 'Cachorrões', 'futsal-masc', 'Grupo B', 'B3', 'campus-taguatinga', 'cachorroes'),
  ('fut-m-next', 'Next', 'futsal-masc', 'Grupo C', 'C1', 'campus-samambaia', 'next'),
  ('fut-m-deepriver', 'Deep River', 'futsal-masc', 'Grupo C', 'C2', 'campus-riacho-fundo', 'deepriver'),
  ('fut-m-estrutural', 'Campus Estrutural', 'futsal-masc', 'Grupo C', 'C3', 'campus-estrutural', 'estrutural'),

  -- Futsal Feminino (Triangular)
  ('fut-f-gatopreto', 'Gato Preto', 'futsal-fem', 'Triangular', 'F1', 'campus-ceilandia', 'gatopreto'),
  ('fut-f-donas', 'Donas da bola', 'futsal-fem', 'Triangular', 'F2', 'campus-taguatinga', 'donas'),
  ('fut-f-sebastiana', 'Sebastiana F.C.', 'futsal-fem', 'Triangular', 'F3', 'campus-sao-sebastiao', 'sebastiana'),

  -- Vôlei de Quadra Misto (2 grupos de 4)
  ('vol-m-ctag', 'Voleibol_Ctag', 'volei-misto', 'Grupo A', 'A1', 'campus-taguatinga', 'voleibol_ctag'),
  ('vol-m-deepriver', 'Deep River', 'volei-misto', 'Grupo A', 'A2', 'campus-riacho-fundo', 'deepriver'),
  ('vol-m-cpla', 'CPLA', 'volei-misto', 'Grupo A', 'A3', 'campus-planaltina', 'cpla'),
  ('vol-m-boratime', 'Bora Time', 'volei-misto', 'Grupo A', 'A4', 'reitoria', 'boratime'),
  ('vol-m-canela', 'Canela de Ema', 'volei-misto', 'Grupo B', 'B1', 'campus-estrutural', 'canela'),
  ('vol-m-gatopreto', 'Gato Preto CCEI', 'volei-misto', 'Grupo B', 'B2', 'campus-ceilandia', 'gatopreto'),
  ('vol-m-titas', 'Titãs do Vôlei', 'volei-misto', 'Grupo B', 'B3', 'campus-brasilia', 'titas'),
  ('vol-m-semdidatica', 'Sem Didática Para Jogar', 'volei-misto', 'Grupo B', 'B4', 'campus-samambaia', 'semdidatica'),

  -- Basquete 3x3 Masculino (2 grupos de 3)
  ('bas-m-estrutural', 'Estrutural', 'basquete-masc', 'Grupo A', 'M-A1', 'campus-estrutural', 'estrutural'),
  ('bas-m-canela', 'Canela de Ema', 'basquete-masc', 'Grupo A', 'M-A2', 'campus-estrutural', 'canela'),
  ('bas-m-quitados', 'Quitados e Queimados', 'basquete-masc', 'Grupo A', 'M-A3', 'reitoria', 'quitados'),
  ('bas-m-ctag', 'CTAG Hoopers', 'basquete-masc', 'Grupo B', 'M-B1', 'campus-taguatinga', 'ctaghoopers'),
  ('bas-m-gatopreto', 'Gato Preto CCEI', 'basquete-masc', 'Grupo B', 'M-B2', 'campus-ceilandia', 'gatopreto'),
  ('bas-m-semdidatica', 'Sem Didática Para Jogar', 'basquete-masc', 'Grupo B', 'M-B3', 'campus-samambaia', 'semdidatica'),

  -- Basquete 3x3 Misto (Triangular)
  ('bas-x-jordana', 'Jordan''as Tagua Clube', 'basquete-misto', 'Triangular', 'X1', 'campus-taguatinga', 'jordana'),
  ('bas-x-gatopreto2', 'Gato Preto Misto 2', 'basquete-misto', 'Triangular', 'X2', 'campus-ceilandia', 'gatopreto'),
  ('bas-x-gatopreto1', 'Gato Preto Misto 1', 'basquete-misto', 'Triangular', 'X3', 'campus-ceilandia', 'gatopreto'),

  -- Vôlei de Praia Masculino (3 grupos de 3)
  ('vpr-m-cest', 'CEST', 'volei-praia-masc', 'Grupo A', 'M-A1', 'campus-estrutural', 'cest'),
  ('vpr-m-estrutural', 'Estrutural', 'volei-praia-masc', 'Grupo A', 'M-A2', 'campus-estrutural', 'estrutural'),
  ('vpr-m-bonde', 'Bonde da Ceilândia', 'volei-praia-masc', 'Grupo A', 'M-A3', 'campus-ceilandia', 'bonde'),
  ('vpr-m-sarues', 'Os Saruês', 'volei-praia-masc', 'Grupo B', 'M-B1', 'campus-brasilia', 'sarues'),
  ('vpr-m-cei2', 'IFB Ceilândia - Equipe 02', 'volei-praia-masc', 'Grupo B', 'M-B2', 'campus-ceilandia', 'cei2'),
  ('vpr-m-canela', 'Canela de Ema', 'volei-praia-masc', 'Grupo B', 'M-B3', 'campus-estrutural', 'canela'),
  ('vpr-m-semdidatica', 'Sem Didática para Jogar', 'volei-praia-masc', 'Grupo C', 'M-C1', 'campus-samambaia', 'semdidatica'),
  ('vpr-m-gatopreto', 'Gato Preto - CCEI', 'volei-praia-masc', 'Grupo C', 'M-C2', 'campus-ceilandia', 'gatopreto'),
  ('vpr-m-sand', 'Sand', 'volei-praia-masc', 'Grupo C', 'M-C3', 'campus-riacho-fundo', 'sand'),
  ('vpr-m-gama', 'Gama Areia', 'volei-praia-masc', 'Grupo D', 'M-D1', 'campus-gama', 'gama'),
  ('vpr-m-planaltina', 'Planaltina Beach', 'volei-praia-masc', 'Grupo D', 'M-D2', 'campus-planaltina', 'galaticos'),

  -- Futevôlei Masculino (Pontos Corridos)
  ('futv-m-mtbrothers', 'MT Brothers', 'futevolei-masc', 'Pontos Corridos', 'M1', 'campus-taguatinga', 'mtbrothers'),
  ('futv-m-canela', 'Canela de Ema', 'futevolei-masc', 'Pontos Corridos', 'M2', 'campus-estrutural', 'canela'),
  ('futv-m-gatopreto', 'Gato Preto', 'futevolei-masc', 'Pontos Corridos', 'M3', 'campus-ceilandia', 'gatopreto'),
  ('futv-m-sandstars', 'Sand Stars', 'futevolei-masc', 'Pontos Corridos', 'M4', 'campus-riacho-fundo', 'sandstars'),
  ('futv-m-sarues', 'Os Saruês', 'futevolei-masc', 'Pontos Corridos', 'M5', 'campus-brasilia', 'sarues'),

  -- Futevôlei Misto (Confronto Direto)
  ('futv-x-soberanas', 'Soberanas do Taguá Clube', 'futevolei-misto', 'Final Direta', 'X1', 'campus-taguatinga', 'soberanas'),
  ('futv-x-deepriver', 'Deep River', 'futevolei-misto', 'Final Direta', 'X2', 'campus-riacho-fundo', 'deepriver'),

  -- Queimada Mista (Chave Única com 6 equipes)
  ('que-x-elite', 'Elite', 'queimada-mista', 'Chave Única', 'X1', 'campus-brasilia', 'elite'),
  ('que-x-gatopreto', 'Gato Preto - CCEI', 'queimada-mista', 'Chave Única', 'X2', 'campus-ceilandia', 'gatopreto'),
  ('que-x-endorfinadas', 'Endorfinadas IFB', 'queimada-mista', 'Chave Única', 'X3', 'reitoria', 'endorfinadas'),
  ('que-x-deepriver', 'Deep River', 'queimada-mista', 'Chave Única', 'X4', 'campus-riacho-fundo', 'deepriver'),
  ('que-x-semdidatica', 'Sem Didática Para Jogar', 'queimada-mista', 'Chave Única', 'X5', 'campus-samambaia', 'semdidatica'),
  ('que-x-donas', 'Donas da Bola', 'queimada-mista', 'Chave Única', 'X6', 'campus-taguatinga', 'donas'),

  -- Handebol Misto Adaptado (Chave Única com 4 equipes)
  ('han-x-furia', 'Fúria Ctga', 'handebol-misto', 'Chave Única', 'X1', 'campus-taguatinga', 'furia'),
  ('han-x-deepriver', 'Deep River', 'handebol-misto', 'Chave Única', 'X2', 'campus-riacho-fundo', 'deepriver'),
  ('han-x-gatopreto', 'Gato Preto CCEI', 'handebol-misto', 'Chave Única', 'X3', 'campus-ceilandia', 'gatopreto'),
  ('han-x-semdidatica', 'Sem Didática Para Jogar', 'handebol-misto', 'Chave Única', 'X4', 'campus-samambaia', 'semdidatica')
ON CONFLICT (id) DO NOTHING;

-- 4. Inserção das Partidas Iniciais (com Data e Horário como "A definir")
INSERT INTO matches (id, modality_id, phase, group_name, team_a_id, team_b_id, team_a_name, team_b_name, status, match_date, match_time, venue, round) VALUES
  -- Futsal Masc - Grupo A
  ('match-fut-1', 'futsal-masc', 'Fase de Grupos', 'Grupo A', 'fut-m-galaticos', 'fut-m-gatopreto', 'Galáticos Cpla', 'Gato Preto - CCEI', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1),
  ('match-fut-2', 'futsal-masc', 'Fase de Grupos', 'Grupo A', 'fut-m-gatopreto', 'fut-m-gama', 'Gato Preto - CCEI', 'Gama', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 2),
  ('match-fut-3', 'futsal-masc', 'Fase de Grupos', 'Grupo A', 'fut-m-galaticos', 'fut-m-gama', 'Galáticos Cpla', 'Gama', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 3),
  -- Futsal Masc - Grupo B
  ('match-fut-4', 'futsal-masc', 'Fase de Grupos', 'Grupo B', 'fut-m-sarues', 'fut-m-canela', 'Os Saruês', 'Canela de Ema', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1),
  ('match-fut-5', 'futsal-masc', 'Fase de Grupos', 'Grupo B', 'fut-m-canela', 'fut-m-cachorroes', 'Canela de Ema', 'Cachorrões', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 2),
  ('match-fut-6', 'futsal-masc', 'Fase de Grupos', 'Grupo B', 'fut-m-sarues', 'fut-m-cachorroes', 'Os Saruês', 'Cachorrões', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 3),
  -- Futsal Masc - Grupo C
  ('match-fut-7', 'futsal-masc', 'Fase de Grupos', 'Grupo C', 'fut-m-next', 'fut-m-deepriver', 'Next', 'Deep River', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1),
  ('match-fut-8', 'futsal-masc', 'Fase de Grupos', 'Grupo C', 'fut-m-deepriver', 'fut-m-estrutural', 'Deep River', 'Campus Estrutural', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 2),
  ('match-fut-9', 'futsal-masc', 'Fase de Grupos', 'Grupo C', 'fut-m-next', 'fut-m-estrutural', 'Next', 'Campus Estrutural', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 3),

  -- Futsal Fem - Triangular
  ('match-futf-1', 'futsal-fem', 'Fase de Grupos', 'Triangular', 'fut-f-gatopreto', 'fut-f-donas', 'Gato Preto', 'Donas da bola', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1),
  ('match-futf-2', 'futsal-fem', 'Fase de Grupos', 'Triangular', 'fut-f-donas', 'fut-f-sebastiana', 'Donas da bola', 'Sebastiana F.C.', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 2),
  ('match-futf-3', 'futsal-fem', 'Fase de Grupos', 'Triangular', 'fut-f-gatopreto', 'fut-f-sebastiana', 'Gato Preto', 'Sebastiana F.C.', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 3),

  -- Vôlei Misto - Grupo A
  ('match-vol-1', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-ctag', 'vol-m-deepriver', 'Voleibol_Ctag', 'Deep River', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 1),
  ('match-vol-2', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-cpla', 'vol-m-boratime', 'CPLA', 'Bora Time', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 1),
  ('match-vol-3', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-ctag', 'vol-m-cpla', 'Voleibol_Ctag', 'CPLA', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 2),
  ('match-vol-4', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-deepriver', 'vol-m-boratime', 'Deep River', 'Bora Time', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 2),
  ('match-vol-5', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-ctag', 'vol-m-boratime', 'Voleibol_Ctag', 'Bora Time', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 3),
  ('match-vol-6', 'volei-misto', 'Fase de Grupos', 'Grupo A', 'vol-m-deepriver', 'vol-m-cpla', 'Deep River', 'CPLA', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 3),

  -- Vôlei Misto - Grupo B
  ('match-vol-7', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-canela', 'vol-m-gatopreto', 'Canela de Ema', 'Gato Preto CCEI', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 1),
  ('match-vol-8', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-titas', 'vol-m-semdidatica', 'Titãs do Vôlei', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 1),
  ('match-vol-9', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-canela', 'vol-m-titas', 'Canela de Ema', 'Titãs do Vôlei', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 2),
  ('match-vol-10', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-gatopreto', 'vol-m-semdidatica', 'Gato Preto CCEI', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 2),
  ('match-vol-11', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-canela', 'vol-m-semdidatica', 'Canela de Ema', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 3),
  ('match-vol-12', 'volei-misto', 'Fase de Grupos', 'Grupo B', 'vol-m-gatopreto', 'vol-m-titas', 'Gato Preto CCEI', 'Titãs do Vôlei', 'Agendado', 'A definir', 'A definir', 'Quadra Poliesportiva Coberta', 3),

  -- Basquete 3x3 Masc
  ('match-bas-1', 'basquete-masc', 'Fase de Grupos', 'Grupo A', 'bas-m-estrutural', 'bas-m-canela', 'Estrutural', 'Canela de Ema', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 1),
  ('match-bas-2', 'basquete-masc', 'Fase de Grupos', 'Grupo A', 'bas-m-canela', 'bas-m-quitados', 'Canela de Ema', 'Quitados e Queimados', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 2),
  ('match-bas-3', 'basquete-masc', 'Fase de Grupos', 'Grupo A', 'bas-m-estrutural', 'bas-m-quitados', 'Estrutural', 'Quitados e Queimados', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 3),
  ('match-bas-4', 'basquete-masc', 'Fase de Grupos', 'Grupo B', 'bas-m-ctag', 'bas-m-gatopreto', 'CTAG Hoopers', 'Gato Preto CCEI', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 1),
  ('match-bas-5', 'basquete-masc', 'Fase de Grupos', 'Grupo B', 'bas-m-gatopreto', 'bas-m-semdidatica', 'Gato Preto CCEI', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 2),
  ('match-bas-6', 'basquete-masc', 'Fase de Grupos', 'Grupo B', 'bas-m-ctag', 'bas-m-semdidatica', 'CTAG Hoopers', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 3),

  -- Basquete 3x3 Misto
  ('match-basx-1', 'basquete-misto', 'Fase de Grupos', 'Triangular', 'bas-x-jordana', 'bas-x-gatopreto2', 'Jordan''as Tagua Clube', 'Gato Preto Misto 2', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 1),
  ('match-basx-2', 'basquete-misto', 'Fase de Grupos', 'Triangular', 'bas-x-gatopreto2', 'bas-x-gatopreto1', 'Gato Preto Misto 2', 'Gato Preto Misto 1', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 2),
  ('match-basx-3', 'basquete-misto', 'Fase de Grupos', 'Triangular', 'bas-x-jordana', 'bas-x-gatopreto1', 'Jordan''as Tagua Clube', 'Gato Preto Misto 1', 'Agendado', 'A definir', 'A definir', 'Quadra de Basquete Externa', 3),

  -- Vôlei de Praia Masc
  ('match-vpr-1', 'volei-praia-masc', 'Fase de Grupos', 'Grupo A', 'vpr-m-cest', 'vpr-m-estrutural', 'CEST', 'Estrutural', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 1),
  ('match-vpr-2', 'volei-praia-masc', 'Fase de Grupos', 'Grupo A', 'vpr-m-estrutural', 'vpr-m-bonde', 'Estrutural', 'Bonde da Ceilândia', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 2),
  ('match-vpr-3', 'volei-praia-masc', 'Fase de Grupos', 'Grupo A', 'vpr-m-cest', 'vpr-m-bonde', 'CEST', 'Bonde da Ceilândia', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 3),
  ('match-vpr-4', 'volei-praia-masc', 'Fase de Grupos', 'Grupo B', 'vpr-m-sarues', 'vpr-m-cei2', 'Os Saruês', 'IFB Ceilândia - Equipe 02', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 2', 1),
  ('match-vpr-5', 'volei-praia-masc', 'Fase de Grupos', 'Grupo B', 'vpr-m-cei2', 'vpr-m-canela', 'IFB Ceilândia - Equipe 02', 'Canela de Ema', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 2', 2),
  ('match-vpr-6', 'volei-praia-masc', 'Fase de Grupos', 'Grupo B', 'vpr-m-sarues', 'vpr-m-canela', 'Os Saruês', 'Canela de Ema', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 2', 3),
  ('match-vpr-7', 'volei-praia-masc', 'Fase de Grupos', 'Grupo C', 'vpr-m-semdidatica', 'vpr-m-gatopreto', 'Sem Didática para Jogar', 'Gato Preto - CCEI', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 1),
  ('match-vpr-8', 'volei-praia-masc', 'Fase de Grupos', 'Grupo C', 'vpr-m-gatopreto', 'vpr-m-sand', 'Gato Preto - CCEI', 'Sand', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 2),
  ('match-vpr-9', 'volei-praia-masc', 'Fase de Grupos', 'Grupo C', 'vpr-m-semdidatica', 'vpr-m-sand', 'Sem Didática para Jogar', 'Sand', 'Agendado', 'A definir', 'A definir', 'Arena de Areia 1', 3),

  -- Futevôlei Misto (Final Direta)
  ('match-futvx-1', 'futevolei-misto', 'Final', 'Final Direta', 'futv-x-soberanas', 'futv-x-deepriver', 'Soberanas do Taguá Clube', 'Deep River', 'Agendado', 'A definir', 'A definir', 'Arena de Areia Central', 1),

  -- Queimada Mista (Chave Única)
  ('match-que-1', 'queimada-mista', 'Fase de Grupos', 'Chave Única', 'que-x-elite', 'que-x-gatopreto', 'Elite', 'Gato Preto - CCEI', 'Agendado', 'A definir', 'A definir', 'Quadra Central', 1),
  ('match-que-2', 'queimada-mista', 'Fase de Grupos', 'Chave Única', 'que-x-endorfinadas', 'que-x-deepriver', 'Endorfinadas IFB', 'Deep River', 'Agendado', 'A definir', 'A definir', 'Quadra Central', 1),
  ('match-que-3', 'queimada-mista', 'Fase de Grupos', 'Chave Única', 'que-x-semdidatica', 'que-x-donas', 'Sem Didática Para Jogar', 'Donas da Bola', 'Agendado', 'A definir', 'A definir', 'Quadra Central', 1),

  -- Handebol Misto (Chave Única)
  ('match-han-1', 'handebol-misto', 'Fase de Grupos', 'Chave Única', 'han-x-furia', 'han-x-deepriver', 'Fúria Ctga', 'Deep River', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1),
  ('match-han-2', 'handebol-misto', 'Fase de Grupos', 'Chave Única', 'han-x-gatopreto', 'han-x-semdidatica', 'Gato Preto CCEI', 'Sem Didática Para Jogar', 'Agendado', 'A definir', 'A definir', 'Ginásio Poliesportivo', 1)
ON CONFLICT (id) DO NOTHING;


-- 5. Inserção do Regulamento Oficial Completo (Capítulos I a X e Anexos I a XII)
INSERT INTO regulations (section_type, section_number, title, content, modality_id, order_index) VALUES
  ('Capítulo', 'I', 'Das Disposições Preliminares e dos Objetivos', 'Art. 1º Este Regulamento é o conjunto de disposições que regem as competições e tem por objetivo disciplinar a organização, as atividades e os eventos esportivos referentes aos Jogos de Integração dos Servidores do Instituto Federal de Brasília (IFB).


Art. 2º Os Jogos são promovidos pela Pró-Reitoria de Gestão de Pessoas (PRGP) com o objetivo de promover a integração, a socialização, o bem-estar, o senso de pertencimento e o fortalecimento do espírito comunitário entre os servidores e colaboradores do IFB, por meio de práticas esportivas e recreativas, culminando em um evento oficial de celebração e identidade institucional.', NULL, 1),
  ('Capítulo', 'II', 'Das Finalidades', 'Art. 3º São finalidades dos Jogos de Integração dos Servidores do IFB:


I – incentivar a prática regular de atividades físicas e esportivas, em consonância com a Política de Atenção à Saúde e Qualidade de Vida no Trabalho (QVT);


II – contribuir para a promoção da saúde física e mental, do bem-estar e da qualidade de vida dos participantes, reconhecendo a prática esportiva como instrumento de prevenção do estresse e de fortalecimento da saúde emocional;


III – estimular a cooperação, o respeito mútuo, o espírito de equipe e o estreitamento dos vínculos interpessoais no ambiente institucional;


IV – promover a integração intercampi e entre unidades da Reitoria, reduzindo barreiras geográficas por meio de um modelo logístico dinâmico;


V – proporcionar momentos de lazer, descontração e convivência saudável, contribuindo para um ambiente de trabalho mais colaborativo e acolhedor.', NULL, 2),
  ('Capítulo', 'III', 'Da Organização e das Competências', 'Art. 4º Constituem instâncias organizadoras e deliberativas dos Jogos de Integração:   
I – Comissão Organizadora;   
II – Subcomissões Esportivas.   


Art. 5º As Subcomissões Esportivas contarão com o apoio técnico e a consultoria dos Professores de Educação Física do IFB, que atuarão como validadores das modalidades em caso de dúvidas técnicas, interpretação de regras ou omissões dos regulamentos específicos.   


Art. 6º Compete a cada Subcomissão Esportiva, em conjunto com os Professores Validadores:   I – elaborar e zelar pelo fiel cumprimento do regulamento técnico específico da respectiva modalidade;   
II – organizar as tabelas de jogos, sorteios de chaves e horários, submetendo-os à homologação da Comissão Organizadora;   
III – atuar como primeira instância na resolução de litígios técnicos, dúvidas e recursos decorrentes das partidas;   
IV – supervisionar a arbitragem e a infraestrutura necessária para a realização das provas ou partidas.   


Art. 7º As decisões de caráter geral ou que envolvam despesas financeiras tomadas pelas Subcomissões deverão ser homologadas pela Diretoria de Qualidade de Vida e Desenvolvimento de Pessoas (DRDP) e autorizadas pela PRGP.', NULL, 3),
  ('Capítulo', 'IV', 'Das Atividades e Modalidades Esportivas', 'Art. 8º As atividades desenvolvidas durante os Jogos de Integração compreendem:   


I – Esportes e atividades de integração: com foco participativo, recreativo e de socialização, de participação ampla;  
II – Esportes de competição: disputados em campeonatos internos com pontuação e premiação por colocação.  


Art. 9º As modalidades esportivas buscarão abranger categorias masculina, feminina e mista, conforme a viabilidade técnica e a quantidade de inscritos.   


Art. 10. Os Jogos de Integração compreenderão as seguintes modalidades:   


§ 1º Modalidades Coletivas:   
I – Basquete 3x3;   
II – Futsal;   
III – Futevôlei;  
 IV – Handebol (Misto Adaptado);   
V – Queimada;   
VI – Vôlei (Quadra Misto);   
VII – Vôlei de Areia.   


§ 2º Modalidades Individuais:   
I – Caminhada e Corrida de Rua (Participativa);   
II – Jogo de Damas;  
III – Natação;   
IV – Tênis de Mesa;   
V – Xadrez.   


§ 3º A inclusão de novas modalidades ou provas poderá ocorrer mediante termo aditivo expedido pela Comissão Organizadora', NULL, 4),
  ('Capítulo', 'V', 'Das Inscrições', 'Art. 11. As competições poderão ser disputadas individualmente ou por equipes formadas exclusivamente por servidores efetivos, substitutos, temporários, estagiários e colaboradores terceirizados em exercício no IFB.   


Art. 12. As inscrições serão efetuadas por formulário eletrônico oficial disponibilizado pela PRGP, no prazo fixado no ato convocatório.', NULL, 5),
  ('Capítulo', 'VI', 'Do Cronograma e da Dinâmica dos Jogos', 'Art. 13. Os Jogos de Integração serão divididos em 2 (duas) etapas principais:   


I – Etapa "Primeiro Lance": voltada exclusivamente às modalidades de mesa e raciocínio (Damas, Tênis de Mesa e Xadrez), realizada em ambientes controlados nos campi com o objetivo de antecipar o engajamento da comunidade acadêmica e mitigar a sobrecarga logística intercampi;   
II – Etapa Geral de Integração: realizada em alusão ao Mês do Servidor Público Federal, concentrando as modalidades coletivas, de areia, quadra, natação e a corrida/caminhada.   


Art. 14. O cronograma detalhado contendo datas, locais e horários de cada etapa será publicado pela Comissão Organizadora com antecedência mínima de 7 (sete) dias da data de início das competições.', NULL, 6),
  ('Capítulo', 'VII', 'Da Disciplina, Saúde e Responsabilidades', 'Art. 15. O participante que praticar agressão física, verbal ou moral contra adversários, companheiros de equipe, membros das comissões, arbitragem ou público será sumariamente excluído da competição, sem prejuízo da apuração de eventuais infrações disciplinares na esfera administrativa cabível.


Art. 16. A participação nos Jogos pressupõe plena condição de saúde, sendo de inteira responsabilidade individual do participante a avaliação médica prévia de sua aptidão física, bem como a assunção de riscos por danos causados por eventuais acidentes ocorridos durante o evento, eximindo a Comissão Organizadora e o IFB de responsabilidade civil.', NULL, 7),
  ('Capítulo', 'VIII', 'Dos Sistemas de Disputa e W.O.', 'Art. 17. Os sistemas de disputa observarão a seguinte estrutura:
I - Torneios Coletivos de Quadra e Campo: Fase de grupos seguida de semifinais e finais em eliminatória simples;
II - Tênis de Mesa e Jogo de Damas: Fase inicial de grupos ou sistema de dupla eliminatória (com chave de repescagem), garantindo a cada competidor um número mínimo de partidas;
III - Xadrez: Sistema Suíço em 5 (cinco) rodadas, gerido por software específico, sem eliminação direta;
IV - Natação: Provas contra o relógio em finais diretas ou séries balizadas por tempo;
V - Corrida e Caminhada: Caráter participativo e integrativo, com certificação/medalha de participação a todos que concluírem o trajeto.


Art. 18. O não comparecimento de equipe ou atleta individual no horário programado na tabela, tolerando-se o atraso máximo de 15 (quinze) minutos para o primeiro jogo da rodada, caracterizará W.O. (Walkover).


§ 1º A equipe ou atleta que der W.O. sem aviso prévio mínimo de 2 (duas) horas à Comissão Organizadora será desclassificado da modalidade na edição vigente.


§ 2º Em caso de W.O. ocorrido em fase de grupos, sem o aviso prévio, todos os resultados anteriores e futuros da referida equipe serão desconsiderados (anulados) para efeito de pontuação geral da chave, visando manter a equidade técnica entre as equipes remanescentes.', NULL, 8),
  ('Capítulo', 'IX', 'Das Premiações', 'Art. 19. A premiação será conferida por modalidade e categoria:
§ 1º Serão concedidas medalhas para o 1º, 2º e 3º colocados de cada categoria/prova quando aplicável.
§ 2º Nas modalidades coletivas, o número de medalhas concedidas equivalerá ao quantitativo de atletas oficialmente inscritos pela equipe, limitado ao teto estabelecido pela Comissão Organizadora: O total de medalhas para as modalidades coletivas será a soma dos titulares mais os reservas, conforme a definição no regulamento da modalidade.
§ 3º Todos os concluintes que estiverem inscritos na Corrida e Caminhada receberão medalha de participação.', NULL, 9),
  ('Capítulo', 'X', 'Das Disposições Finais', 'Art. 20 A Comissão Organizadora se reserva o direito de alterar formatos de disputa, datas, horários e locais dos jogos, informando os capitães das equipes com a antecedência possível.


Art. 21. Os casos omissos ou situações não contempladas neste Regulamento serão deliberados pela Comissão Organizadora, ouvidos os Professores de Educação Física.




ANEXOS TÉCNICOS
REGRAS ESPECÍFICAS DAS MODALIDADES', NULL, 10),
  ('Anexo', 'I', 'Basquete 3x3', '1. Inscrição Coletiva e Composição:
* Inscrição de atletas ampla por unidade.
* Em cada partida, a equipe apresentará em súmula o mínimo de 3 e o máximo de 4 atletas (3 titulares e 1 reserva).
2. Tempo de Jogo:
* Tempo único de 10 minutos corridos ou até que uma equipe atinja 21 pontos (o que ocorrer primeiro).
* O relógio será parado apenas quando ocorrer lance livre.
3. Prorrogação (Empate):
* Em caso de empate no final do tempo regulamentar, haverá prorrogação sem limite de tempo; vencerá a equipe que marcar os primeiros 2 pontos.
4. Pontuação:
* Cestas convertidas dentro do arco (linha de 3 pontos convencional) valem 1 ponto.
* Cestas convertidas atrás do arco valem 2 pontos.
* Lances livres convertidos valem 1 ponto.
5. Dinâmica e Posse de Bola:
* Disputado em meia-quadra oficial ou adaptada com uma tabela.
* Após cesta sofrida: A partida não é interrompida; a equipe que sofreu o ponto retoma a bola debaixo do aro e deve passá-la ou conduzi-la para além da linha do arco antes de tentar finalizar.
* Mudança de posse (rebote defensivo, roubada de bola ou toco): A equipe que recuperar a bola deve obrigatoriamente limpá-la fora do arco (ambos os pés fora da linha) antes de atacar.
* Rebote ofensivo: A equipe mantém a posse e pode arremessar imediatamente sem a necessidade de sair do arco.
* Tempo limite de posse de Bola: A equipe que estiver com a posse tem no máximo 24 segundos de posse, perdendo a posse após o término do tempo. O tempo será reiniciado caso a bola toque o aro.
6. Faltas Coletivas e Disciplina:
* O limite de faltas coletivas é de 6 por equipe. Da 7ª à 9ª falta coletiva, a equipe adversária tem direito a 2 lances livres. A partir da 10ª falta, o adversário terá direito a 2 lances livres e à posse de bola.
* Não há eliminação por faltas individuais comuns. A desqualificação decorre de 2 faltas antidesportivas, 2 faltas técnicas ou 1 falta desqualificante direta cometida pelo mesmo jogador.
* Falta Antidesportiva (contato ilegal/violento sem tentativa de jogar a bola): Conta como 2 faltas coletivas; pune-se com 2 lances livres para o adversário e, na reincidência do jogador, desqualificação imediata.
* Falta Técnica (conduta antidesportiva sem contato físico, reclamações acintosas ou simulações): Pune-se com 1 lance livre para o adversário, seguido de reinício normal em check-ball.
* Falta Desqualificante (agressão física direta ou insultos gravíssimos): Expulsão imediata da partida, 2 lances livres mais a posse de bola para a equipe adversária, sujeita à suspensão de todo o torneio.', 'basquete-masc', 11),
  ('Anexo', 'II', 'Corrida de Rua e Caminhada (Integração)', '1. Inscrição: Individual (Categorias Masculina e Feminina).
2. Caráter da Prova: Exclusivamente participativo e de integração comunitária; não haverá pódio por tempo ou cronometragem punitiva. Todos os concluintes que estiverem inscritos recebem medalha de participação.
3. Condições de Saúde: O atleta declara que está apto para a atividade física para esforço cardiovascular moderado/intenso.
4. Largada e Percurso:
   * Concentração com antecedência mínima de 30 minutos em relação ao horário oficial de largada.
   * O trajeto deverá ser integralmente cumprido nas faixas demarcadas e sinalizadas pela organização. O corte de caminho invalida a conclusão da prova.
5. Segurança e Conduta:
   * É vedado qualquer auxílio externo de tração motora ou condução física forçada.
   * A equipe de apoio ou socorristas presentes poderá determinar a interrupção da caminhada/corrida por motivo evidente de fadiga extrema ou risco à saúde do participante.
   * Em caso de tempestades com raios ou intempéries severas, a largada poderá ser suspensa ou cancelada por decisão da Comissão Organizadora.', 'corrida-caminhada', 12),
  ('Anexo', 'III', 'Jogo de Damas', '1. Inscrição:Individual.
2. Movimentação e Captura: 
* Movimento ordinário: As peças comuns andam apenas para a frente, uma casa por vez, nas diagonais formadas pelas casas escuras.
* Captura obrigatória: Havendo oportunidade, a captura é obrigatória. Conforme as regras oficiais brasileiras, a captura de peças pode ser realizada tanto para a frente quanto para trás, sendo obrigatório o encadeamento de capturas múltiplas.
* A Dama: Ao atingir a última fileira adversária, a peça torna-se Dama, passando a movimentar-se e capturar em diagonal para a frente e para trás, percorrendo quantas casas vazias desejar.
3. Formato de Disputa:
* 1ª Fase (Grupos): Participantes divididos em chaves de 4 jogadores em turno único (todos contra todos). Se necessário, será definifo formas de desempate entre os presentes, tendo a decisão final a comissão organizadora.
* 2ª Fase (Mata-Mata): Classificam-se os 2 melhores de cada chave para as Semifinais cruzadas (1ºA x 2ºB; 1ºB x 2ºA), com posterior disputa de Final e 3º lugar.
4. Controle de Tempo: Relógio com 10 minutos para cada jogador por partida (tempo total máximo de 20 minutos).', 'damas-aberto', 13),
  ('Anexo', 'IV', 'Xadrez', '1. Inscrição:Individual.
2. Sistema de Disputa:
* Sistema Suíço em 5 (cinco) rodadas.
* Todos os enxadristas jogam as 5 rodadas, não havendo eliminação por derrota.
* A 1ª rodada é definida por sorteio; a partir da 2ª rodada, os confrontos ocorrem entre competidores com pontuação idêntica ou equivalente na tabela.
* Emparceiramento e desempate gerenciados por aplicativo/software especializado (ex: Swiss-Manager ou plataforma digital compatível).
3. Controle de Tempo (Xadrez Rápido): Tempo de reflexão de 10 a 15 minutos nocaute para cada jogador, sem acréscimo de bônus, sendo definido no dia do evento com o número real de participantes.
4. Regras Gerais: Vigora a regra padrão da FIDE de "peça tocada é peça jogada". A vitória ocorre por xeque-mate, abandono ou término do tempo do oponente no relógio.', 'xadrez-aberto', 14),
  ('Anexo', 'V', 'Futsal', '1. Inscrição Coletiva e Composição:
* Mínimo de 5 atletas inscritos por equipe.
* Em jogo, cada equipe atuará com 5 atletas (1 goleiro e 4 de linha), na quadra e no máximo 7 no banco, sendo exigido o mínimo de 4 atletas aptos para o início da partida.
* As substituições são volantes e ilimitadas dentro da zona de substituição, devendo o atleta substituído deixar a quadra antes do ingresso do reserva.
2. Tempo de Jogo:
* 2 (dois) tempos de 15 minutos corridos.
* O cronômetro será paralisado exclusivamente nos 2 (dois) minutos finais do segundo tempo da partida.
3. Sistema de Disputa e Classificação (Chaveamento para 9 Equipes):
* 1ª Fase (Fase de Grupos): As 9 equipes serão divididas por sorteio em 3 (três) grupos de 3 equipes (Grupos A, B e C), jogando entre si dentro do grupo em turno único.
* Classificação para a Fase Final: Avançam às Semifinais 4 (quatro) equipes:
   * O 1º colocado de cada um dos 3 grupos (3 equipes);
   * A 4ª vaga será decidida entre os três segundos colocados dos grupos que serão ordenados em uma classificação comparativa, conforme os critérios de desempate estabelecidos neste regulamento.
      * A fase de playoffs será disputada em duas partidas, conforme a seguinte organização:
      * Na primeira partida, denominada Playoff Preliminar, o 2º (segundo) melhor colocado entre os segundos colocados enfrentará o 3º (terceiro) melhor colocado entre os segundos colocados;
      * Na segunda partida, o vencedor do Playoff Preliminar enfrentará o 1º (primeiro) melhor colocado entre os segundos colocados;
      * A equipe vencedora da segunda partida estará classificada para as semifinais da competição.
      * O melhor 2º colocado geral entre os três grupos (1 equipe), apurado pelo índice técnico comparativo.
* Fase Semifinal (Mata-Mata):
   * Semifinal 1: 1º colocado geral entre os líderes de grupo vs. Vencedor do Playoff.
   * Semifinal 2: 2º colocado geral entre os líderes vs. 3º colocado geral entre os líderes.
* Fase Final: Os vencedores disputam a final (1º e 2º lugares) e os perdedores disputam a partida de definição de 3º e 4º lugares.
4. Sistema de Pontuação na Fase de Grupos:
* Vitória no tempo regulamentar: 3 (três) pontos.
* Empate no tempo regulamentar: cada equipe receberá 1 (um) ponto, sendo realizada, obrigatoriamente, uma disputa de pênaltis para definir a equipe vencedora;
* Vitória na disputa de pênaltis, após empate no tempo regulamentar: a equipe vencedora receberá 1 (um) ponto adicional, totalizando 2 (dois) pontos na partida, enquanto a equipe derrotada permanecerá com 1 (um) ponto
5. Critérios de Desempate (Fase de Grupos e Comparativo de 2º Colocados):
* Em caso de igualdade de pontos entre duas ou mais equipes, serão aplicados sucessivamente:
   * I – Confronto direto (aplicável apenas em empate entre duas equipes da mesma chave);
   * II – Maior número de vitórias;
   * III – Maior saldo de gols;
   * IV – Maior número de gols marcados (gols pró);
   * V – Menor número de gols sofridos;
   * VI – Menor número de cartões vermelhos recebidos;
   * VII – Menor número de cartões amarelos recebidos;
   * VIII – Sorteio público conduzido pela Comissão Organizadora.
6. Desempate em Fases Eliminatórias (Semifinais e Finais):
* Em caso de empate no tempo normal nas semifinais ou finais, o vencedor será definido imediatamente por cobrança de penalidades máximas:
   * Série inicial de 3 (três) cobranças alternadas por equipe, com cobradores distintos.
   * Persistindo o empate, cobranças alternadas de 1x1 até que haja um vencedor, não podendo nenhum atleta repetir a cobrança até que todos os aptos (inclusive reservas e goleiro) tenham cobrado.
   * O número de atletas das duas equipes que participarão da disputa de penalidades será definido com base na quantidade de atletas da equipe com menos atletas.
7. Regras Específicas de Jogo:
* Reposições: Cobranças de lateral e escanteio efetuadas com os pés sobre ou atrás da linha, no prazo de até 4 (quatro) segundos.
* Regra do Goleiro: Proibido tocar a bola com as mãos fora de sua área penal; no campo de defesa, o goleiro poderá reter a bola por no máximo 4 segundos (permitido apenas um recuo voluntário com os pés por posse de bola, podendo receber a bola novamente se o goleiro receber a bola após o meio de quadra).
* Faltas Coletivas: A partir da 5ª falta coletiva da equipe em cada tempo, todas as faltas posteriores serão punidas com Tiro Livre Direto (sem barreira) da marca de 10 metros.', 'futsal-masc', 15),
  ('Anexo', 'VI', 'Futevôlei', '1. Inscrição Coletiva: Modalidade em Duplas — máximo de 3 atletas por equipe (2 titulares em quadra e 1 reserva).
2. Sistema de Disputa - Masculino: 
   * Fase única no formato todos contra todos (4 partidas por dupla).
   * A pontuação geral acumulada define o pódio final (campeão, vice-campeão e 3º lugar), aplicando-se os critérios técnicos de desempate se houver igualdade de pontos.
   * Duração das partidas: disputadas em set único de 18 pontos corridos com vantagem de 2 pontos.
3. Sistema de Disputa e Duração — Categoria Mista (2 equipes):
* Disputa em confronto direto em partida final única.
* Duração da partida: disputada em melhor de 3 sets de 12 pontos corridos com vantagem de 2 pontos.
4. Toques e Reposições:
   * Máximo de 3 toques por equipe antes do envio da bola ao lado adversário; é proibido que o mesmo atleta dê dois toques consecutivos.
   * Saque executado atrás da linha de fundo, chutando a bola direto do chão (permitido montinho de areia).
5. Faltas e Restrições: É proibido qualquer contato com mãos, braços ou antebraços, bem como toque involuntário ou voluntário na rede durante a disputa de ponto.', 'futevolei-masc', 16),
  ('Anexo', 'VII', 'Handebol (Misto Adaptado)', '1. Inscrição Coletiva: Mínimo de 7 atletas inscritos por equipe.
2. Tempo de Jogo: 2 tempos de 15 minutos corridos, com o cronômetro travado durante pedidos de tempo e nos 2 minutos finais do segundo tempo.
3. Composição em Quadra e Dinâmica Mista Adaptada:
* Cada equipe terá em quadra 7 jogadores (1 goleiro e 6 atletas de linha: 3 homens e 3 mulheres).
* Divisão de Meia-Quadra: Por sorteio, define-se quem inicia o ataque com o naipe masculino ou feminino. Caso a equipe "A" inicie atacando com 3 mulheres, a equipe adversária defenderá obrigatoriamente com suas 3 mulheres nessa metade da quadra. Na outra metade da quadra, posicionam-se os 3 homens de cada equipe (3 atacando e 3 defendendo).
* Nenhum atleta de linha pode ultrapassar a linha divisória do meio da quadra nessa fase, e os passes entre setores devem respeitar essa barreira.
* Troca aos 5 Minutos: A cada 5 minutos, inverte-se o posicionamento das funções (quem atacava passa a defender e vice-versa), garantindo que todos os atletas atuem tanto no ataque quanto na defesa.
* Fase Livre: A partir da terceira troca (último terço do jogo), as equipes poderão ultrapassar livremente a linha divisória, seguindo o jogo conforme as regras tradicionais da modalidade.
4. Manejo da Bola e Área Penal:
* O atleta pode dar no máximo 3 passos com a bola na mão ou segurá-la parada por até 3 segundos antes de passar ou arremessar. É proibido o duplo drible.
* Nenhum atleta de linha pode pisar na área de 6 metros do goleiro.
5. Disciplina:
* Faltas graves ou antidesportivas acarretam exclusão temporária por 1 (um) minuto da quadra.
6. Sistema de Disputa (4 equipes mistas):
* 1ª Fase (Classificatória): Todas as 4 equipes enfrentam-se em turno único (todos contra todos), totalizando 3 partidas por equipe.
* Semifinais: Confrontos definidos pela classificação da 1ª Fase:
   * Semifinal 1: 1º colocado geral x 4º colocado geral
   * Semifinal 2: 2º colocado geral x 3º colocado geral
* Fase Final: Disputa de 3º lugar entre os perdedores das semifinais e final entre os vencedores.', 'handebol-misto', 17),
  ('Anexo', 'VIII', 'Natação', '1. Inscrição: Individual. Cada atleta poderá se inscrever em até 2 provas individuais.
2. Quadro de Provas Reduzido (Foco em Velocidade e Segurança):
   * Provas Individuais:
      * 25 metros Livre (Masculino e Feminino)
      * 50 metros Livre (Masculino e Feminino)
      * 100 metros Livre (Masculino e Feminino)
3. Formato de Disputa: Finais Diretas Cronometradas. As séries são balizadas por sorteio; a classificação final decorre da ordenação decrescente dos melhores tempos obtidos entre todas as baterias.
4. Regras Básicas: Duas largadas falsas desclassificam o atleta. O competidor deve concluir a prova na mesma raia em que largou; tocar o solo para descansar é tolerado desde que sem impulsão ou avanço na piscina.
5. Vestimento: recomendado o uso de ôculos de natação, sunga na modalidade masculina e maiô na modalidade feminina. Obrigatório uso de touca.', 'natacao-geral', 18),
  ('Anexo', 'IX', 'Queimada', '1. Inscrição Coletiva e Composição: Mínimo de 8 de atletas inscritos por equipe.
* Em jogo, cada equipe iniciará com 8 atletas titulares em quadra, devendo haver, no mínimo, 3 mulheres.
* Cada equipe deverá designar formalmente um(a) Capitão(ã), único(a) autorizado(a) a representar a equipe e solicitar esclarecimentos à arbitragem.
* Não serão permitidas substituições durante a partida em andamento, salvo em caso de lesão física comprovada e autorizada pelo árbitro.
2. Tempo de Jogo e Critério de Vitória:
* Tempo regulamentar de 15 minutos corridos.
* Vence a equipe que queimar todos os adversários no campo principal ou a que mantiver o maior número de atletas ativos ao término do tempo.
* Havendo empate na contagem de atletas ao fim dos 15 minutos, a partida será decidida em "morte súbita" (o primeiro atleta a ser queimado encerra o jogo).
3. Regras de Queimação e Segurança:
* Área Válida de Contato: É considerado queimado o jogador atingido diretamente pela bola entre a linha dos ombros e a dos pés, desde que a bola toque o solo ou anteparo externo em seguida.
* Proteção à Cabeça/Rosto: Lance que atingir diretamente a cabeça ou o rosto do adversário não configurará queimada; o jogo será paralisado imediatamente para atendimento e a posse de bola passará para a equipe do jogador atingido.
* Defesa Válida: Se a bola bater no atleta (ou em companheiro de equipe) e for agarrada no ar antes de tocar o solo, a queimação é anulada e a partida prossegue normalmente. Também será anulada caso após a queimação a bola bata em algum atleta adversário antes de tocar no chão.
* Esquiva Irregular: O atleta com a posse de bola que verificar a saída deliberadade um adversário dos limites da quadra, em qualquer momento da partida,  poderá jogar a bola na quadra adversária e declarar que o adversário está queimado, sendo confirmadopela arbitragem.
* Bola rodada: é proibido utilizar a estratégia de bola rodada (encaixe no braço).
4. Dinâmica do Cemitério e Retorno (Ressurreição):
* Iniciará o jogo com um atleta no cemitério (pivô), podendo queirmar a partir da sua quarta posse de bola.
* Ao ser queimado, o atleta desloca-se para a área de cemitério (linha de fundo oposta), atuando ativamente nos lançamentos contra os oponentes.
* O atleta posicionado no cemitério que conseguir queimar no primeiro arremesso um adversário terá o direito de retornar à quadra principal de sua equipe.
* A lateral da quadra pertence a equipe do mesmo lado da quadra, podendo pegar a bola e retornar para dentro dos limites da quadra para arremessar.
5. Posse, Manejo e Revezamento da Bola:
* Manejo estritamente manual: a bola deve ser arremessada exclusivamente com as mãos, sendo expressamente proibido chutá-la.
* Não é permitido avançar no arremesso (meia lua), sob pena de perda da posse.
* Limite de retenção: tempo máximo de 5 segundos de posse com a bola parada na mão de um mesmo jogador; excedido o prazo, a posse é revertida ao adversário.
* Arremessos: é vedado passar a bola para o companheiro de equipe; quem interceptar a bola deve arremessar.
* É permitido lançar a bola do campo para o cemitério e vice-versa apenas 3 vezes seguidas, sendo obrigado a queima após os lançamentos.
* Proibido esconder a bola ou retardar o reinício da partida; saída de bola tem posse determinada pela arbitragem conforme a trajetória.
6. Invasão de Linha:
* É permitido pisar sobre as linhas demarcatórias (central, laterais e de fundo) durante os movimentos de ataque e defesa.
* Configura invasão a passagem integral do pé sobre a linha em direção à quadra adversária, acarretando a perda imediata da posse de bola.
7. Sistema de Disputa (6 equipes mistas):
* 1ª Fase (Classificatória): Turno único com todas as equipes jogando contra todas (todos contra todos), totalizando 5 partidas por equipe.
* Semifinais: As 4 melhores equipes da tabela geral avançam às Semifinais (1º x 4º e 2º x 3º).
* Fase Final: Partida de definição de 3º lugar (entre os perdedores das semifinais) e final para definição de campeão e vice-campeão.', 'queimada-mista', 19),
  ('Anexo', 'X', 'Tênis de Mesa', '1. Inscrição: Individual.
2. Categorias de Disputa:
   * Torneio Feminino Exclusivo: Chave de grupo único ou eliminatória dupla entre as inscritas femininas, assegurando pódio próprio.
   * Categoria Absoluto (Geral): Torneio aberto congregando todos os inscritos (masculino e feminino), em fase de grupos seguida de mata-mata ou repescagem.
3. Sistema de Partida: Dependendo do número de participantes no dia, a disputa será em melhor de 5 ou 3 sets de 11 pontos cada (vence quem conquistar 3 sets primeiro). O saque alterna-se a cada 2 pontos. Em caso de empate em 10 a 10 o saque será alternado a cada ponto e o jogo termina quando um dos atletas tiver vantagem de dois pontos.
4. Execução do Saque e Jogo: A bola deve repousar sobre a palma da mão aberta e ser lançada verticalmente pelo menos 16 cm para cima antes do golpe. É falta tocar na mesa com a mão livre enquanto a bola estiver em disputa.
5. Vestimenta e equipamento: É expressamente proibido o uso de blusa ou camiseta branca pelos competidores, a fim de evitar qualquer confusão visual com a bola e é proibido a utilização de raquete sem borracha.', 'tenis-mesa-geral', 20),
  ('Anexo', 'XI', 'Vôlei (Quadra Misto)', '1. Inscrição Coletiva: Mínimo de 6 atletas por equipe.
2. Composição em Quadra: Categoria Mista, com presença obrigatória de 6 atletas em quadra sendo no mínimo 2 mulheres durante toda a partida e até 6 atletas no banco.
3. Pontuação: Partida disputada em melhor de 3 sets (os dois primeiros até 25 pontos e o terceiro/tie-break até 15 pontos, sempre com margem de 2 pontos para fechamento).
4. 5. Arbitragem e Tolerância:
   * O toque na fita superior da rede durante a ação de jogo é estritamente proibido.
   * Pequenas imperfeições técnicas no levantamento de toque serão toleradas pela arbitragem para favorecer a fluidez dos rallies entre servidores amadores.
6. Ausência / Incompletude: Equipe sem o número mínimo regulamentar (6 atletas, sendo no mínimo 2 mulheres) no horário determinado perderá por W.O. (0x2 em sets, 0x25 em cada set).
7. Interrupções: Cada equipe tem direito a, no máximo, dois tempos de descanso e quantidade livre de substituições, sendo que o jogador substituído só poderá retornar à posição do mesmo jogador.
8. Sistema de Disputa (8 equipes mistas):
* 1ª Fase (Grupos): Divisão por sorteio em 2 grupos de 4 equipes (Grupo A e Grupo B), jogando entre si em turno único dentro da chave.
* Semifinais (Mata-Mata): Classificam-se as 2 melhores equipes de cada grupo, em cruzamento olímpico direto:
   * Semifinal 1: 1º colocado do Grupo A x 2º colocado do Grupo B
   * Semifinal 2: 1º colocado do Grupo B x 2º colocado do Grupo A
* Fase Final: Os perdedores das semifinais realizam a partida de disputa de 3º lugar e os vencedores disputam a final.', 'volei-misto', 21),
  ('Anexo', 'XII', 'Vôlei de Praia (Areia)', '1. Inscrição Coletiva: Duplas (2 atletas titulares e 1 reserva opcional inscrito).
2. No jogo: Apenas 2 atletas titulares sem reserva. A substituição só poderá ocorrer em partidas posteriores em caso de lesão ou ausência justificada.
3. Pontuação: Partida em melhor de 3 sets: os dois primeiros até 15 pontos e o set de desempate (tie-break) até 11 pontos, com vantagem mínima de 2 pontos.
4. Troca de Lados: As duplas invertem de lado a cada 5 pontos jogados, nos dois primeiros sets, e a cada 4 pontos jogados, no tie-break, para atenuar as influências de sol e vento.
5. Toques e Bloqueio: Máximo de 3 toques por equipe. O toque no bloqueio conta como o primeiro toque da equipe.
6. Especificidades Técnicas Adaptadas:
   * Ataque: Proibida a largada com a ponta dos dedos ("toquinho"); o golpe de ataque deve ser desferido com a palma aberta ou soco.
   * Recepção e Defesa: Não se admite recepção de saque por toque articulado (deve-se usar manchete ou golpe firme).
   * Passe para o Campo Adversário por Toque: Permitido apenas se a bola for projetada em trajetória estritamente perpendicular à linha dos ombros do atleta, com rotação limpa.
   * Levantamento: Aplica-se critério de arbitragem recreativa, admitindo-se tolerância razoável quanto à retenção ou rotação leve da bola para evitar paralisações contínuas da partida.
7. Sistema de Disputa - Masculino (9 equipes):
* 1ª Fase (Grupos): 3 chaves com 3 duplas cada, com confrontos internos em turno único.
* Fase Final: Classificam-se os 1º colocados de cada chave e a melhor 2ª colocada geral por índice técnico para as Semifinais (1º Geral x Melhor 2º; 2º Geral x 3º Geral), seguidas de disputa de 3º lugar e final.
8. Sistema de Disputa - Feminino (3 equipes) e Misto (3 equipes):
   * Disputados de forma independente em formato de triangular (todos contra todos dentro da respectiva categoria), definindo-se o pódio conforme a classificação e pontuação geral acumulada.', 'volei-praia-masc', 22)
ON CONFLICT DO NOTHING;
