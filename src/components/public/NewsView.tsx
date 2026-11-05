import React, { useState } from 'react';
import { Notice } from '../../types/database';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { Newspaper, Calendar, User, Search, Tag, Eye } from 'lucide-react';

export interface NewsViewProps {
  notices: Notice[];
}

export const NewsView: React.FC<NewsViewProps> = ({ notices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = ['all', 'Destaque', 'Geral', 'Técnico', 'Urgente'] as const;

  const filteredNotices = notices.filter((n) => {
    const matchCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchSearch =
      !searchTerm ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.summary && n.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header e Filtros de Notícias */}
      <div className="bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-m3-primary dark:text-m3-primary-dark" />
            Notícias e Comunicados da Comissão
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe comunicados oficiais, resumos de rodadas e fotos dos Jogos JIS-IFB 2026.
          </p>
        </div>

        {/* Busca e Categoria */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar notícia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
            >
            </input>
          </div>
        </div>
      </div>

      {/* Filtros em Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 rounded-m3-full text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-bold'
                  : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-600 dark:text-slate-300 border border-m3-outline-variant/50 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todas as Notícias' : cat}
            </button>
          );
        })}
      </div>

      {/* Grid de Notícias */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-12 bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant p-8">
          <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Nenhuma notícia encontrada</h3>
          <p className="text-xs text-slate-500 mt-1">Altere os filtros ou termo de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotices.map((item) => (
            <M3Card
              key={item.id}
              variant="elevated"
              className="overflow-hidden flex flex-col justify-between hover:border-m3-primary/50 transition-all border border-m3-outline-variant/30"
            >
              {item.image_url && (
                <div className="h-44 -mx-4 -mt-4 mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setActiveNotice(item)}
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-m3-primary/10 text-m3-primary dark:text-m3-primary-dark font-bold flex items-center gap-1">
                    <Tag size={11} />
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.published_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h3
                  onClick={() => setActiveNotice(item)}
                  className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 hover:text-m3-primary dark:hover:text-m3-primary-dark transition-colors cursor-pointer"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                  {item.summary || item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <User size={12} />
                  {item.author || 'Comissão JIS'}
                </span>
                <button
                  onClick={() => setActiveNotice(item)}
                  className="text-xs font-bold text-m3-primary dark:text-m3-primary-dark hover:underline flex items-center gap-1"
                >
                  <Eye size={13} />
                  Ler na íntegra
                </button>
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* Modal Leitor Completo de Notícia */}
      <M3Dialog
        isOpen={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        title={activeNotice?.title || ''}
        maxWidth="2xl"
      >
        {activeNotice && (
          <div className="space-y-4">
            {activeNotice.image_url && (
              <div className="rounded-m3-md overflow-hidden max-h-72 bg-slate-100 dark:bg-slate-800">
                <img
                  src={activeNotice.image_url}
                  alt={activeNotice.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-m3-outline-variant/30 pb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-m3-primary/10 text-m3-primary dark:text-m3-primary-dark font-bold">
                {activeNotice.category}
              </span>
              <span>
                Publicado em: {new Date(activeNotice.published_at).toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {activeNotice.content}
            </div>

            {activeNotice.author && (
              <div className="text-xs text-slate-400 pt-2 border-t border-m3-outline-variant/20 italic">
                Por: {activeNotice.author}
              </div>
            )}
          </div>
        )}
      </M3Dialog>
    </div>
  );
};
