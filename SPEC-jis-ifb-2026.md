# Especificação Oficial: JIS-IFB 2026 (Jogos de Integração dos Servidores)

> **Documento Fonte da Verdade (Spec-Driven Development)**  
> **Versão:** 1.0.0  
> **Status:** Aprovado  
> **Instituição:** Instituto Federal de Educação, Ciência e Tecnologia de Brasília (IFB)  
> **Organização:** Pró-Reitoria de Gestão de Pessoas (PRGP) / Diretoria de Qualidade de Vida e Desenvolvimento de Pessoas (DRDP)

---

## 1. Mapa de Capacidades (Capability Map - Phase 0)

| ID do Módulo | Responsabilidade Principal | Dependências |
|---|---|---|
| `core-schema` | Modelos de dados TypeScript, tipagem do Supabase, validação de regras do regulamento oficial | — |
| `data-sync` | Camada de persistência (Supabase Cloud + Local Storage Fallback) e WebSockets em tempo real | `core-schema` |
| `design-system-m3` | Tokens Material Design 3 (M3 Expressive), micro-interações Motion.dev, modo claro/escuro e acessibilidade WCAG 2.1 AA | — |
| `public-portal` | Placar ao vivo, cronograma interativo, tabelas de classificação com desempate oficial, chaveamentos mata-mata, quadro híbrido de medalhas/pontos e leitor de regulamento | `core-schema`, `data-sync`, `design-system-m3` |
| `admin-backoffice` | Painel de controle da comissão organizadora: autenticação por senha mestra, CRUD completo de partidas, equipes, atletas e exportação/backup com feedback auditável | `core-schema`, `data-sync`, `design-system-m3` |

**Ordem de Construção / Dependência:**  
`core-schema` → `design-system-m3` → `data-sync` → `public-portal` → `admin-backoffice`

---

## 2. Comandos do Projeto (Executable Commands)

```bash
# Instalação de dependências
npm install

# Servidor de desenvolvimento local (Vite HMR)
npm run dev

# Verificação de tipos e compilação de produção
npm run build

# Execução da suíte de testes de regras de negócio
npm test

# Visualização da compilação estática
npm run preview
```

---

## 3. Estrutura do Repositório

```
jis_IFB_2026/
├── public/
│   └── images/
│       ├── logo-jis.jpg         # Logo oficial dos Jogos de Integração
│       └── logo-ifb.png         # Logo institucional do IFB
├── src/
│   ├── components/
│   │   ├── admin/               # Módulo admin-backoffice (CRUD e Gestão)
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── MatchManager.tsx
│   │   │   ├── TeamManager.tsx
│   │   │   ├── IndividualManager.tsx
│   │   │   └── BackupExport.tsx
│   │   ├── avatars/             # Avatars vetoriais das 26 equipes
│   │   │   └── TeamAvatar.tsx
│   │   ├── m3/                  # Módulo design-system-m3
│   │   │   ├── M3TopAppBar.tsx  # Navegação M3 com active pill animado
│   │   │   ├── M3Button.tsx
│   │   │   ├── M3Card.tsx
│   │   │   └── M3Badge.tsx
│   │   └── public/              # Módulo public-portal
│   │       ├── LiveScoreboard.tsx
│   │       ├── StandingsTable.tsx
│   │       ├── BracketTree.tsx
│   │       ├── HybridMedalsTable.tsx
│   │       ├── ScheduleView.tsx
│   │       └── RegulationViewer.tsx
│   ├── hooks/                   # Hooks customizados reutilizáveis
│   │   └── useJISData.ts        # Separação limpa de dados e apresentação
│   ├── lib/                     # Camada de utilitários e dados
│   │   ├── matchHelpers.ts      # Utilitários de partidas e formatação
│   │   ├── standingsCalculator.ts # Algoritmo oficial de desempate e pontuação
│   │   ├── supabase.ts          # Cliente e fallback local
│   │   ├── mockData.ts          # Carga de dados iniciais do regulamento
│   │   └── fullRegulations.json # 22 seções completas do regulamento oficial
│   ├── types/
│   │   └── database.ts          # Contratos de tipos do sistema
│   ├── App.tsx                  # Componente raiz declarativo
│   └── main.tsx                 # Entrada React
├── tests/
│   └── standings.test.ts        # Testes unitários com Node.js Test Runner
├── supabase/
│   ├── schema.sql               # DDL do PostgreSQL + RLS + Triggers
│   └── seed.sql                 # Dados iniciais homologados
├── SPEC-jis-ifb-2026.md         # Esta especificação
└── vercel.json                  # Configuração de roteamento SPA na Vercel
```

---

## 4. Requisitos e Critérios de Aceite por Módulo

### Módulo `public-portal`
1. **Placar em Tempo Real (`LiveScoreboard`)**:
   - Exibir badge com efeito térmico/pulsante quando houver partidas com status `"Ao Vivo"`.
   - Permitir filtro simultâneo por modalidade esportiva e status (`Ao Vivo`, `Agendado`, `Finalizado`).
   - Apresentar avatars oficiais de cada equipe coletiva e praça esportiva de cada confronto.
2. **Classificação Oficial (`StandingsTable`)**:
   - Calcular pontuação específica por modalidade (ex: Futsal: vitória 3 pts, pênaltis ganhos 2 pts, pênaltis perdidos 1 pt).
   - Aplicar critérios de desempate automáticos: Pontos > Vitórias > Saldo > Gols Pró > Menos Gols Sofridos.
   - Apresentar quebra responsiva de botões de modalidade, sem truncamento em dispositivos móveis.
3. **Chaveamento Gráfico (`BracketTree`)**:
   - Mapear Futsal Masculino, Basquete 3x3, Vôlei de Quadra Misto, Vôlei de Praia e Futevôlei.
   - Suportar o formato específico do Futevôlei (Misto em final direta e Masculino em pontos corridos).
4. **Quadro Híbrido de Medalhas e Pontos (`HybridMedalsTable`)**:
   - Oferecer 3 visões intercambiáveis: Ponderado Oficial (10-7-5-1 pts), Quadro Olímpico e Pontos Totais.
5. **Regulamento Oficial (`RegulationViewer`)**:
   - Apresentar o texto integral das 22 seções (Capítulos I–X e Anexos I–XII) com pesquisa reativa por termos.

### Módulo `admin-backoffice`
1. **Acesso Controlado**:
   - Autenticação por senha mestra com persistência de sessão em `sessionStorage`.
2. **CRUD Completo**:
   - **Inserir**: Criação de novas partidas, equipes com seleção de avatar e participantes individuais.
   - **Buscar**: Filtro por status, modalidade e busca textual instantânea.
   - **Modificar**: Atualização ponto a ponto de placares, horários, locais e pódios individuais.
   - **Remover**: Exclusão segura com diálogo de confirmação.
3. **Auditoria e Confirmação**:
   - Indicador visual em tempo real do status da base de dados (Supabase Cloud vs Local Storage).
   - Toast flutuante com carimbo de data/hora a cada modificação com sucesso.
   - Botão para teste de integridade da conexão.

### Módulo `design-system-m3`
1. **Diretrizes Material You (M3)**:
   - Uso de superfícies tonais (`surface-container`, `surface-container-high`, `surface-container-low`).
   - Tema Claro como padrão inicial, com persistência da preferência de Modo Escuro no `localStorage`.
2. **Acessibilidade (WCAG 2.1 AA)**:
   - Uso de papéis semânticos (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`).
   - Foco visual nítido (`focus-visible:ring-2 focus-visible:ring-m3-primary`).
   - Rótulos textuais e `aria-label` para todos os botões de ícone.
3. **Micro-interações (Motion.dev)**:
   - Indicador de aba ativa fluido com `layoutId="activeNavPill"`.
   - Transições de entrada suaves nas mudanças de página e nos cards de partidas.
