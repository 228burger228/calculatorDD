import React, { useState } from 'react';
import { SavedProject } from '../../types/history';
import { formatCurrency } from '../../utils/currency';
import { History, Search, Trash2, ArrowUpRight, Download, Upload, Clock, Plus } from 'lucide-react';

interface ProjectHistoryListProps {
  projects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onImportProjects: (imported: SavedProject[]) => void;
}

export const ProjectHistoryList: React.FC<ProjectHistoryListProps> = ({
  projects,
  onLoadProject,
  onDeleteProject,
  onImportProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = projects.filter((p) => {
    const text = (p.name + ' ' + p.clientName + ' ' + p.parameters.projectType).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dmitry_dima_pricing_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProjects(parsed);
        }
      } catch (err) {
        alert('Ошибка при импорте JSON файла');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            <span>История проектов и смет ({projects.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Сохраненные расчеты для клиентов. Любой проект можно открыть и пересчитать в 1 клик.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            disabled={projects.length === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт JSON</span>
          </button>

          <label className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Импорт</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию проекта, заказчику или типу..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Projects List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">
            {projects.length === 0 ? 'История смет пока пуста' : 'Ничего не найдено по запросу'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {projects.length === 0
              ? 'Нажмите «В историю» в блоке расчета сметы, чтобы сохранить текущий проект.'
              : 'Попробуйте изменить поисковую фразу.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Заказчик: <span className="text-slate-300 font-medium">{project.clientName}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-violet-300 px-2 py-0.5 rounded-lg bg-violet-950/80 border border-violet-800/40 shrink-0">
                    {formatCurrency(project.result.finalPrice)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {project.parameters.projectType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {project.parameters.pagesCount} стр / {project.parameters.screensCount} экр
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {project.result.estimatedDays.min}–{project.result.estimatedDays.max} раб. дней
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(project.updatedAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Удалить расчет"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onLoadProject(project)}
                    className="px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-medium text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Открыть в сметчике</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
