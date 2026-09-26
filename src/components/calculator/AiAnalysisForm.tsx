import React, { useState } from 'react';
import { ProjectParameters, PricingConfig } from '../../types/pricing';
import { SAMPLE_PROMPTS, SamplePrompt } from '../../config/samplePrompts';
import { analyzeClientMessageWithAI, AIAnalysisResult } from '../../core/aiParser';
import { MissingWorksAlert } from './MissingWorksAlert';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, Bot, AlertCircle } from 'lucide-react';

interface AiAnalysisFormProps {
  params: ProjectParameters;
  config: PricingConfig;
  onApplyAIParams: (applied: ProjectParameters) => void;
}

export const AiAnalysisForm: React.FC<AiAnalysisFormProps> = ({
  params,
  config,
  onApplyAIParams,
}) => {
  const [clientText, setClientText] = useState(params.notes || SAMPLE_PROMPTS[0].clientMessage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleSelectPreset = (preset: SamplePrompt) => {
    setClientText(preset.clientMessage);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!clientText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClientMessageWithAI(clientText, config.geminiApiKey);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!analysisResult) return;
    onApplyAIParams({
      ...params,
      projectName: analysisResult.projectName,
      clientName: analysisResult.clientName,
      projectType: analysisResult.projectType,
      pagesCount: analysisResult.pagesCount,
      screensCount: analysisResult.screensCount,
      componentsCount: analysisResult.componentsCount,
      complexity: analysisResult.complexity,
      urgency: analysisResult.urgency,
      isStudentTrack: analysisResult.isStudentTrack,
      selectedWorks: analysisResult.selectedWorks,
      notes: clientText,
    });
  };

  const handleAddMissingWork = (workItemId: string) => {
    if (!analysisResult) return;
    if (!analysisResult.selectedWorks.includes(workItemId)) {
      const updatedWorks = [...analysisResult.selectedWorks, workItemId];
      setAnalysisResult({
        ...analysisResult,
        selectedWorks: updatedWorks,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900 border border-violet-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI-Анализ входящего запроса клиента</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-900/60 border border-violet-700/40 text-violet-300">
                {config.geminiApiKey ? 'Gemini 3.8 Flash' : 'NLP Heuristic Engine'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Вставьте реальное сообщение заказчика из Telegram или выберите кейс из практики. AI выделит страницы, экраны, скрытые потребности и сформирует матрицу параметров.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Prompts Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Примеры реальных запросов клиентов:
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                clientText === p.clientMessage
                  ? 'bg-violet-900/40 border-violet-500 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{p.title}</span>
              <span className="text-[10px] text-slate-500 font-mono">({p.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Текст сообщения или ТЗ от клиента:
        </label>
        <textarea
          rows={5}
          value={clientText}
          onChange={(e) => setClientText(e.target.value)}
          placeholder="Вставьте сюда сырое сообщение заказчика: «Привет! Нужен сайт для строительной компании на 7 страниц...»"
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors leading-relaxed placeholder:text-slate-600"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            Символов: {clientText.length}
          </span>
          <button
            type="button"
            disabled={isAnalyzing || !clientText.trim()}
            onClick={handleAnalyze}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:brightness-110 active:scale-98'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Анализирую задачу...' : 'Анализировать сообщение AI'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Preview */}
      {analysisResult && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-violet-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">
                Результат AI-анализа параметров проекта
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Источник: {analysisResult.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Локальный NLP-парсер'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Тип проекта</span>
              <span className="font-semibold text-slate-200 capitalize">{analysisResult.projectType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Страниц / Экранов</span>
              <span className="font-semibold text-cyan-400 font-mono">
                {analysisResult.pagesCount} стр / {analysisResult.screensCount} экр
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Сложность / Срок</span>
              <span className="font-semibold text-amber-400 capitalize">
                {analysisResult.complexity} / {analysisResult.urgency}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Студ. трек</span>
              <span className={`font-semibold ${analysisResult.isStudentTrack ? 'text-emerald-400' : 'text-slate-400'}`}>
                {analysisResult.isStudentTrack ? 'Да (Льготный)' : 'Нет'}
              </span>
            </div>
          </div>

          {analysisResult.explanation && (
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-violet-300 block mb-0.5">Обоснование модели:</span>
              {analysisResult.explanation}
            </div>
          )}

          {/* Missing Works Suggestions */}
          {analysisResult.missingSuggestions && analysisResult.missingSuggestions.length > 0 && (
            <MissingWorksAlert
              suggestions={analysisResult.missingSuggestions}
              onAddWork={handleAddMissingWork}
              alreadyAddedIds={analysisResult.selectedWorks}
            />
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Применить параметры в калькулятор</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
