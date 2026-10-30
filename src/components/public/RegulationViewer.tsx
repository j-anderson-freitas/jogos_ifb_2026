import React, { useState } from 'react';
import { Regulation } from '../../types/database';
import { M3Card } from '../m3/M3Card';
import { BookOpen, Search, FileText, CheckCircle2 } from 'lucide-react';

export interface RegulationViewerProps {
  regulations: Regulation[];
}

export const RegulationViewer: React.FC<RegulationViewerProps> = ({ regulations }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'Capítulo' | 'Anexo'>('all');

  const filteredRegulations = regulations.filter((r) => {
    const matchesType = selectedType === 'all' || r.section_type === selectedType;
    const matchesSearch =
      !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.section_number.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header do Regulamento */}
      <div className="p-6 rounded-m3-lg bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-m3-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Documento Oficial • PRGP/IFB
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
            Regulamento Geral e Anexos Técnicos
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Conjunto de normas oficiais que regem as competições, conduta disciplinar e pontuação dos Jogos de Integração dos Servidores.
          </p>
        </div>

        <a
          href="https://docs.google.com/document/d/1_sZnf5MmYnoWSznjOQ74mjOUrr0pz89IjSHlQ6RGej4/edit?tab=t.0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-m3-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-colors"
        >
          <FileText size={16} />
          <span>Ver Original no Google Docs</span>
        </a>
      </div>

      {/* Controles de Busca e Filtro */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg">
        {/* Filtro por Tipo */}
        <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40">
          {(['all', 'Capítulo', 'Anexo'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? 'Todos os Artigos' : type === 'Capítulo' ? 'Capítulos Gerais' : 'Regras por Modalidade (Anexos)'}
            </button>
          ))}
        </div>

        {/* Busca por Palavra-Chave */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por artigos, faltas, pênaltis, W.O..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Lista de Artigos e Anexos */}
      <div className="space-y-4">
        {filteredRegulations.map((reg) => (
          <M3Card key={reg.id} variant="elevated" className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-m3-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-m3-primary-container text-m3-primary-on-container dark:bg-m3-primary-container-dark dark:text-m3-primary-on-container-dark">
                  {reg.section_type} {reg.section_number}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {reg.title}
                </h3>
              </div>
              <CheckCircle2 size={16} className="text-m3-primary flex-shrink-0" />
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {reg.content}
            </div>
          </M3Card>
        ))}
      </div>
    </div>
  );
};
