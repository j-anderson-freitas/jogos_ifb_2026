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
  ('volei-praia-masc', 'Vôlei de Praia', 'Masculino', 'coletiva', 'Geral', 'grupos_3', 'Sun', '3 grupos de 3 duplas. 1ºs de cada grupo + melhor 2º geral avançam para as Semifinais.', 6),
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

-- 5. Inserção do Regulamento Oficial
INSERT INTO regulations (section_type, section_number, title, content, modality_id, order_index) VALUES
  ('Capítulo', 'I', 'Das Disposições Preliminares e Objetivos', 'Art. 1º Este Regulamento é o conjunto de disposições que regem as competições e tem por objetivo disciplinar a organização, as atividades e os eventos esportivos referentes aos Jogos de Integração dos Servidores do IFB.\n\nArt. 2º Os Jogos são promovidos pela Pró-Reitoria de Gestão de Pessoas (PRGP) com o objetivo de promover a integração, socialização, bem-estar e senso de pertencimento.', NULL, 1),
  ('Capítulo', 'II', 'Das Finalidades', 'Art. 3º São finalidades incentivar práticas de QVT (Qualidade de Vida no Trabalho), estreitar vínculos comunitários e integrar servidores dos campi e reitoria.', NULL, 2),
  ('Capítulo', 'VI', 'Do Cronograma e Dinâmica dos Jogos', 'Art. 13. Os Jogos são divididos em 2 etapas:\nI – Etapa Primeiro Lance: modalidades de raciocínio e mesa (Damas, Tênis de Mesa e Xadrez).\nII – Etapa Geral de Integração: modalidades de quadra, areia, natação e corrida no Mês do Servidor.', NULL, 3),
  ('Capítulo', 'VIII', 'Dos Sistemas de Disputa e W.O.', 'Art. 17. Sistemas de disputa com fase de grupos, semifinais e finais.\nArt. 18. Tolerância máxima de 15 minutos para início da rodada, caracterizando W.O. caso a equipe não compareça.', NULL, 4),
  ('Anexo', 'V', 'Futsal', 'Tempo de jogo: 2 tempos de 15 min corridos. Vitória normal: 3 pontos. Empate leva obrigatoriamente a pênaltis: vencedor nos pênaltis soma 2 pontos e o derrotado soma 1 ponto. Playoff preliminar entre 2ºs colocados.', 'futsal-masc', 5),
  ('Anexo', 'XI', 'Vôlei de Quadra Misto', 'Equipes com 6 atletas em quadra (mínimo 2 mulheres). Melhor de 3 sets (25/15 pontos, vantagem de 2 pontos). Semifinais cruzadas.', 'volei-misto', 6),
  ('Anexo', 'IX', 'Queimada Mista', '8 atletas titulares (mínimo 3 mulheres). 15 minutos de tempo regulamentar. Sistema cemitério com ressurreição ao queimar de primeira.', 'queimada-mista', 7)
ON CONFLICT DO NOTHING;

