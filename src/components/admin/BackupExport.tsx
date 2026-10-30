import React from 'react';
import { Match, CollectiveTeam, Campus, IndividualPodium } from '../../types/database';
import { M3Card } from '../m3/M3Card';
import { M3Button } from '../m3/M3Button';
import { Download, FileSpreadsheet, Printer, Database, HardDriveDownload } from 'lucide-react';

export interface BackupExportProps {
  matches: Match[];
  teams: CollectiveTeam[];
  campuses: Campus[];
  podiums: IndividualPodium[];
}

export const BackupExport: React.FC<BackupExportProps> = ({
  matches,
  teams,
  campuses,
  podiums,
}) => {
  // Exportar Partidas em CSV
  const exportMatchesCSV = () => {
    const headers = ['ID', 'Modalidade', 'Fase', 'Grupo', 'Equipe A', 'Placar A', 'Placar B', 'Equipe B', 'Status', 'Data', 'Horário', 'Local'];
    const rows = matches.map((m) => [
      m.id,
      m.modality_id,
      m.phase,
      m.group_name || '',
      `"${m.team_a_name}"`,
      m.score_a,
      m.score_b,
      `"${m.team_b_name}"`,
      m.status,
      m.match_date,
      m.match_time,
      `"${m.venue}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jis_ifb_2026_partidas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar Equipes em CSV
  const exportTeamsCSV = () => {
    const headers = ['ID', 'Nome da Equipe', 'Modalidade', 'Grupo', 'Campus ID', 'Avatar Key'];
    const rows = teams.map((t) => [
      t.id,
      `"${t.name}"`,
      t.modality_id,
      t.group_name || '',
      t.campus_id || '',
      t.avatar_key,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jis_ifb_2026_equipes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download do Backup Completo JSON
  const downloadJSONBackup = () => {
    const backupData = {
      project: 'JIS-IFB 2026',
      exported_at: new Date().toISOString(),
      campuses,
      teams,
      matches,
      podiums,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_jis_ifb_2026_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <M3Card variant="elevated" className="p-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-m3-outline-variant/30">
          <Database className="w-6 h-6 text-m3-primary dark:text-m3-primary-dark" />
          <div>
            <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
              Relatórios e Backup de Dados
            </h3>
            <p className="text-xs text-slate-500">
              Exportação de dados para planilhas, relatórios oficiais de súmula e salvaguarda completa do banco.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Exportação CSV */}
          <div className="p-4 rounded-m3-md bg-slate-50 dark:bg-slate-900 border border-m3-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
              <FileSpreadsheet className="text-emerald-600" size={18} />
              <span>Exportar Planilhas (CSV / Excel)</span>
            </div>
            <p className="text-xs text-slate-500">
              Gera arquivos compatíveis com Excel, LibreOffice e Google Sheets com os dados atualizados das partidas e equipes.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <M3Button variant="tonal" size="sm" icon={<Download size={14} />} onClick={exportMatchesCSV}>
                Partidas (CSV)
              </M3Button>
              <M3Button variant="tonal" size="sm" icon={<Download size={14} />} onClick={exportTeamsCSV}>
                Equipes (CSV)
              </M3Button>
            </div>
          </div>

          {/* Card Backup JSON & Impressão */}
          <div className="p-4 rounded-m3-md bg-slate-50 dark:bg-slate-900 border border-m3-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
              <HardDriveDownload className="text-m3-primary" size={18} />
              <span>Backup do Banco de Dados & Impressão</span>
            </div>
            <p className="text-xs text-slate-500">
              Baixe uma cópia integral de segurança de todos os dados do sistema em JSON ou imprima o relatório oficial.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <M3Button variant="filled" size="sm" icon={<HardDriveDownload size={14} />} onClick={downloadJSONBackup}>
                Backup Completo (1-Clique)
              </M3Button>
              <M3Button variant="outlined" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>
                Imprimir Relatório
              </M3Button>
            </div>
          </div>
        </div>
      </M3Card>
    </div>
  );
};

