-- ====================================================================
-- JIS-IFB 2026: SUPABASE POSTGRESQL SCHEMA
-- Jogos de Integração dos Servidores do Instituto Federal de Brasília
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Campi do IFB
CREATE TABLE IF NOT EXISTS campuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Modalidades Esportivas
CREATE TABLE IF NOT EXISTS modalities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Masculino', 'Feminino', 'Misto', 'Aberto'
  type TEXT NOT NULL,     -- 'coletiva', 'individual'
  stage TEXT NOT NULL,    -- 'Primeiro Lance', 'Geral'
  format TEXT NOT NULL,   -- 'grupos_3', 'grupos_4', 'triangular', 'pontos_corridos', 'chave_unica', 'suico', 'cronometrado'
  icon TEXT NOT NULL,
  rules_summary TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Equipes Coletivas
CREATE TABLE IF NOT EXISTS collective_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  modality_id TEXT NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  group_name TEXT,       -- 'Grupo A', 'Grupo B', 'Grupo C', 'Chave Única', 'Triangular'
  initial_code TEXT,     -- 'A1', 'A2', 'B1', 'X1', 'F1', etc.
  campus_id TEXT REFERENCES campuses(id) ON DELETE SET NULL,
  avatar_key TEXT NOT NULL, -- Identificador do avatar SVG
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Participantes de Modalidades Individuais
CREATE TABLE IF NOT EXISTS individual_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  campus_id TEXT NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  modality_id TEXT NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  event_category TEXT,   -- '25m Livre', '50m Livre', 'Absoluto', 'Feminino', 'Participativa'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Pódios e Resultados de Modalidades Individuais
CREATE TABLE IF NOT EXISTS individual_podiums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modality_id TEXT NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  event_category TEXT NOT NULL,
  position INT NOT NULL, -- 1 (Ouro), 2 (Prata), 3 (Bronze)
  participant_name TEXT NOT NULL,
  campus_id TEXT NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  score_time_detail TEXT, -- ex: '00:14.22' ou '5/5 vitórias'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabela de Partidas (Matches)
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  modality_id TEXT NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,       -- 'Fase de Grupos', 'Playoff', 'Semifinal', 'Disputa 3º Lugar', 'Final', 'Turno Único'
  group_name TEXT,           -- 'Grupo A', 'Grupo B', 'Grupo C', 'Chave Única'
  team_a_id TEXT REFERENCES collective_teams(id) ON DELETE CASCADE,
  team_b_id TEXT REFERENCES collective_teams(id) ON DELETE CASCADE,
  team_a_name TEXT NOT NULL,
  team_b_name TEXT NOT NULL,
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  score_penalties_a INT,     -- Usado no Futsal em caso de empate (vencedor nos pênaltis = 2 pts)
  score_penalties_b INT,
  sets_detail TEXT,          -- Detalhe de sets para Vôlei/Futevôlei, ex: '25-21, 23-25, 15-12'
  status TEXT NOT NULL DEFAULT 'Agendado', -- 'Agendado', 'Ao Vivo', 'Finalizado', 'Adiado'
  match_date TEXT DEFAULT 'A definir',    -- Data da partida
  match_time TEXT DEFAULT 'A definir',    -- Horário da partida
  venue TEXT DEFAULT 'A definir',         -- Praça esportiva
  round INT DEFAULT 1,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabela de Notícias e Avisos Oficiais da Comissão
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT,
  category TEXT DEFAULT 'Geral',
  pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabela de Artigos do Regulamento Oficial
CREATE TABLE IF NOT EXISTS regulations (
  id SERIAL PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'Capítulo' ou 'Anexo'
  section_number TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  modality_id TEXT,
  order_index INT DEFAULT 0
);

-- 10. Tabela de Registros de Quilometragem (Desafio da Corrida & Caminhada)
CREATE TABLE IF NOT EXISTS distance_records (
  id TEXT PRIMARY KEY,
  participant_id UUID REFERENCES individual_participants(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  campus_id TEXT NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  distance_km NUMERIC(6, 2) NOT NULL DEFAULT 0,
  date TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'Servidor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- Permitir leitura pública irrestrita e operações seguras
-- ====================================================================
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE collective_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_podiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE distance_records ENABLE ROW LEVEL SECURITY;

-- Leitura pública para todos
CREATE POLICY "Public Read Campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public Read Modalities" ON modalities FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON collective_teams FOR SELECT USING (true);
CREATE POLICY "Public Read Participants" ON individual_participants FOR SELECT USING (true);
CREATE POLICY "Public Read Podiums" ON individual_podiums FOR SELECT USING (true);
CREATE POLICY "Public Read Matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public Read Notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public Read Regulations" ON regulations FOR SELECT USING (true);
CREATE POLICY "Public Read Distance Records" ON distance_records FOR SELECT USING (true);

-- Permissões de escrita (para API anon com checagem no client/admin)
CREATE POLICY "Allow Write Campuses" ON campuses FOR ALL USING (true);
CREATE POLICY "Allow Write Modalities" ON modalities FOR ALL USING (true);
CREATE POLICY "Allow Write Teams" ON collective_teams FOR ALL USING (true);
CREATE POLICY "Allow Write Participants" ON individual_participants FOR ALL USING (true);
CREATE POLICY "Allow Write Podiums" ON individual_podiums FOR ALL USING (true);
CREATE POLICY "Allow Write Matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow Write Notices" ON notices FOR ALL USING (true);
CREATE POLICY "Allow Write Regulations" ON regulations FOR ALL USING (true);
CREATE POLICY "Allow Write Distance Records" ON distance_records FOR ALL USING (true);

-- Habilitar Realtime para a tabela de Matches e Distances
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE distance_records;

