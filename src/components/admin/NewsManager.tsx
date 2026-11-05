import React, { useState } from 'react';
import { Notice } from '../../types/database';
import { saveNotice, deleteNotice } from '../../lib/supabase';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { Plus, Trash2, Edit3, Newspaper, Image, Calendar, Tag, AlertTriangle } from 'lucide-react';

export interface NewsManagerProps {
  notices: Notice[];
  onDataChanged: () => void;
}

export const NewsManager: React.FC<NewsManagerProps> = ({ notices, onDataChanged }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Destaque' | 'Geral' | 'Técnico' | 'Urgente'>('Geral');
  const [author, setAuthor] = useState('Comissão JIS-IFB');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Geral');
    setAuthor('Comissão JIS-IFB');
    setImageUrl('');
    setEditingNotice(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: Notice) => {
    setEditingNotice(n);
    setTitle(n.title);
    setSummary(n.summary || '');
    setContent(n.content);
    setCategory(n.category);
    setAuthor(n.author || 'Comissão JIS-IFB');
    setImageUrl(n.image_url || '');
    setIsModalOpen(true);
  };

  // Processar e comprimir imagem no navegador via Canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1000;
        let w = img.width;
        let h = img.height;

        if (w > maxW) {
          h = Math.round((h * maxW) / w);
          w = maxW;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setImageUrl(dataUrl);
        }
        setIsCompressing(false);
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const toSave: Notice = {
      id: editingNotice ? editingNotice.id : `notice-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      category,
      author: author.trim(),
      image_url: imageUrl || undefined,
      published_at: editingNotice ? editingNotice.published_at : new Date().toISOString(),
      pinned: category === 'Destaque',
    };

    await saveNotice(toSave);
    setIsModalOpen(false);
    resetForm();
    onDataChanged();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteNotice(deletingId);
    setDeletingId(null);
    onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* Header e Ações */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-m3-primary dark:text-m3-primary-dark" />
            Gestão de Notícias & Comunicados
          </h2>
          <p className="text-xs text-slate-500">
            Publique informes oficiais, avisos urgentes e cobertura fotográfica dos jogos
          </p>
        </div>

        <div>
          <M3Button
            variant="filled"
            size="sm"
            icon={<Plus size={16} />}
            onClick={handleOpenCreate}
          >
            Publicar Nova Notícia
          </M3Button>
        </div>
      </div>

      {/* Lista de Notícias */}
      {notices.length === 0 ? (
        <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
          <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhuma notícia publicada</h4>
          <p className="text-xs text-slate-500 mt-1">
            Clique em "Publicar Nova Notícia" para divulgar comunicados com fotos no portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notices.map((n) => (
            <M3Card key={n.id} variant="elevated" className="overflow-hidden flex flex-col justify-between border border-m3-outline-variant/30">
              {n.image_url && (
                <div className="h-36 -mx-4 -mt-4 mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-m3-primary/10 text-m3-primary font-bold">
                    {n.category}
                  </span>
                  <span>{new Date(n.published_at).toLocaleDateString('pt-BR')}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {n.summary || n.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{n.author}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(n)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    title="Editar"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(n.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-full"
                    title="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* Modal: Publicar / Editar Notícia */}
      <M3Dialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingNotice ? 'Editar Notícia' : 'Publicar Nova Notícia Oficial'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Título da Notícia</label>
            <input
              type="text"
              required
              placeholder="Ex: Resultados do Primeiro Lance e Programação de Amanhã"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
              >
                <option value="Destaque">Destaque (Capa)</option>
                <option value="Geral">Geral</option>
                <option value="Técnico">Técnico</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Autor / Assinatura</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Resumo Curto (Prévia no Dashboard)</label>
            <input
              type="text"
              placeholder="Breve resumo da matéria em 1 a 2 linhas..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Conteúdo Completo</label>
            <textarea
              required
              rows={5}
              placeholder="Escreva o texto completo da notícia ou comunicado oficial..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant leading-relaxed"
            />
          </div>

          {/* Upload de Imagem */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-m3-sm border border-m3-outline-variant/30 space-y-2">
            <label className="block text-xs font-semibold flex items-center gap-1.5">
              <Image size={15} className="text-m3-primary" />
              Imagem da Notícia (Upload com Otimização Automática)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-m3-full file:border-0 file:text-xs file:font-semibold file:bg-m3-primary file:text-white hover:file:bg-m3-primary/90 cursor-pointer"
              />
              {isCompressing && (
                <span className="text-xs text-slate-400 animate-pulse">Processando imagem...</span>
              )}
            </div>

            {imageUrl && (
              <div className="mt-2 relative w-32 h-20 rounded-m3-sm overflow-hidden border border-slate-300 dark:border-slate-700">
                <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[10px]"
                  title="Remover imagem"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button
              variant="text"
              size="sm"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              {editingNotice ? 'Salvar Alterações' : 'Publicar Notícia'}
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal de Confirmação de Remoção */}
      <M3Dialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirmar Remoção da Notícia"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-m3-md">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              Tem certeza que deseja remover esta notícia? A publicação deixará de ser exibida no portal imediatamente.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <M3Button variant="text" size="sm" onClick={() => setDeletingId(null)}>
              Cancelar
            </M3Button>
            <M3Button variant="danger" size="sm" onClick={handleDelete}>
              Sim, Remover
            </M3Button>
          </div>
        </div>
      </M3Dialog>
    </div>
  );
};
