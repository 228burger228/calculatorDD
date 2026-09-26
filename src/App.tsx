import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, ActiveTab } from './components/layout/Navigation';
import { ModeSelector, CalculationMode } from './components/calculator/ModeSelector';
import { StandardModeForm } from './components/calculator/StandardModeForm';
import { QuickModeForm } from './components/calculator/QuickModeForm';
import { AiAnalysisForm } from './components/calculator/AiAnalysisForm';
import { MissingWorksAlert } from './components/calculator/MissingWorksAlert';
import { PriceDisplay } from './components/result/PriceDisplay';
import { CostBreakdown } from './components/result/CostBreakdown';
import { WhyThisPrice } from './components/result/WhyThisPrice';
import { TierComparisonView } from './components/result/TierComparisonModal';
import { ClientQuoteModal } from './components/quote/ClientQuoteModal';
import { ProjectHistoryList } from './components/history/ProjectHistoryList';
import { PricingSettingsForm } from './components/settings/PricingSettingsForm';

import { ProjectParameters, PricingConfig } from './types/pricing';
import { SavedProject } from './types/history';
import { calculateProjectEstimate } from './core/pricingEngine';
import { buildScenarioComparison } from './core/scenarioBuilder';
import { generateClientQuote } from './core/quoteGenerator';
import { detectMissingWorks } from './core/missingWorksDetector';
import {
  loadPricingConfig,
  savePricingConfig,
  resetPricingConfig,
  loadLastParameters,
  saveLastParameters,
  loadSavedProjects,
  saveProjectToHistory,
  deleteProjectFromHistory,
} from './utils/storage';
import { DMITRY_DIMA_STUDIO } from './types/studio';

export const App: React.FC = () => {
  // Navigation & Mode States
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [calcMode, setCalcMode] = useState<CalculationMode>('standard');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Core Data States
  const [config, setConfig] = useState<PricingConfig>(loadPricingConfig);
  const [params, setParams] = useState<ProjectParameters>(loadLastParameters);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(loadSavedProjects);

  // Sync parameters to localStorage on change
  useEffect(() => {
    saveLastParameters(params);
    setIsSavedRecently(false);
  }, [params]);

  // Real-time deterministic calculations
  const result = useMemo(() => {
    return calculateProjectEstimate(params, config);
  }, [params, config]);

  const tierComparison = useMemo(() => {
    return buildScenarioComparison(params, config);
  }, [params, config]);

  const clientQuote = useMemo(() => {
    return generateClientQuote(params, result);
  }, [params, result]);

  const missingSuggestions = useMemo(() => {
    return detectMissingWorks(params.notes || '', params);
  }, [params.notes, params.selectedWorks, params.projectType, params.urgency]);

  // Handlers
  const handleSaveConfig = (updated: PricingConfig) => {
    setConfig(updated);
    savePricingConfig(updated);
  };

  const handleResetConfig = () => {
    const fresh = resetPricingConfig();
    setConfig(fresh);
  };

  const handleSaveCurrentProject = () => {
    const newProject: SavedProject = {
      id: 'proj_' + Date.now(),
      name: params.projectName || 'Без названия',
      clientName: params.clientName || 'Заказчик',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parameters: params,
      result: result,
      quoteText: clientQuote.telegramText,
      status: 'draft',
    };
    const updated = saveProjectToHistory(newProject);
    setSavedProjects(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleLoadProject = (project: SavedProject) => {
    setParams(project.parameters);
    setActiveTab('calculator');
  };

  const handleDeleteProject = (id: string) => {
    const updated = deleteProjectFromHistory(id);
    setSavedProjects(updated);
  };

  const handleImportProjects = (imported: SavedProject[]) => {
    setSavedProjects(imported);
    localStorage.setItem('agy_dnd_saved_projects_v4', JSON.stringify(imported));
  };

  const handleAddMissingWork = (workItemId: string) => {
    if (!params.selectedWorks.includes(workItemId)) {
      setParams({
        ...params,
        selectedWorks: [...params.selectedWorks, workItemId],
      });
    }
  };

  const handleSelectTier = (tier: 'basic' | 'standard' | 'premium') => {
    if (tier === 'basic') {
      setParams((prev) => ({
        ...prev,
        pagesCount: Math.min(prev.pagesCount, 3),
        screensCount: Math.min(prev.screensCount, 4),
        componentsCount: 1,
        complexity: 'simple',
        urgency: 'normal',
        selectedWorks: prev.selectedWorks.filter((w) =>
          ['work_frontend', 'work_responsive', 'work_crm_leads', 'work_ui_design', 'work_qa_testing'].includes(w)
        ).length > 0 
          ? prev.selectedWorks.filter((w) => ['work_frontend', 'work_responsive', 'work_crm_leads', 'work_ui_design', 'work_qa_testing'].includes(w))
          : ['work_frontend', 'work_responsive', 'work_crm_leads', 'work_qa_testing'],
      }));
    } else if (tier === 'standard') {
      setParams((prev) => ({
        ...prev,
        pagesCount: Math.max(prev.pagesCount, 6),
        screensCount: Math.max(prev.screensCount, 8),
        componentsCount: Math.max(prev.componentsCount, 3),
        complexity: 'medium',
        urgency: 'fast',
        selectedWorks: Array.from(new Set([
          ...prev.selectedWorks,
          'work_ui_design',
          'work_frontend',
          'work_responsive',
          'work_cms',
          'work_crm_leads',
          'work_seo',
          'work_qa_testing',
        ])),
      }));
    } else if (tier === 'premium') {
      setParams((prev) => ({
        ...prev,
        pagesCount: Math.max(prev.pagesCount, 10),
        screensCount: Math.max(prev.screensCount, 14),
        componentsCount: Math.max(prev.componentsCount, 5),
        complexity: 'hard',
        urgency: 'fast',
        selectedWorks: Array.from(new Set([
          ...prev.selectedWorks,
          'work_ui_design',
          'work_prototype',
          'work_frontend',
          'work_responsive',
          'work_animations',
          'work_cms',
          'work_backend',
          'work_database',
          'work_crm_leads',
          'work_seo',
          'work_analytics',
          'work_qa_testing',
        ])),
      }));
    }
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      
      {/* 1. Studio Header */}
      <Header />

      {/* 2. Top Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedProjects.length}
      />

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: Calculator */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            
            {/* Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <ModeSelector
                currentMode={calcMode}
                onModeChange={setCalcMode}
              />

              <div className="text-xs text-slate-400 font-mono hidden md:block">
                Формула: Base + AddOns × Complexity × Urgency
              </div>
            </div>

            {/* Missing Scope Alert on standard form if notes contain triggers */}
            {missingSuggestions.length > 0 && calcMode === 'standard' && (
              <MissingWorksAlert
                suggestions={missingSuggestions}
                onAddWork={handleAddMissingWork}
                alreadyAddedIds={params.selectedWorks}
              />
            )}

            {/* Split Grid: Left Form (60%) | Right Live Estimate (40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form according to mode */}
              <div className="lg:col-span-7 space-y-6">
                
                {calcMode === 'quick' && (
                  <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
                    <QuickModeForm
                      params={params}
                      config={config}
                      onChange={setParams}
                      onSwitchToStandard={() => setCalcMode('standard')}
                    />
                  </div>
                )}

                {calcMode === 'standard' && (
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
                    <StandardModeForm
                      params={params}
                      config={config}
                      onChange={setParams}
                    />
                  </div>
                )}

                {calcMode === 'ai_analysis' && (
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
                    <AiAnalysisForm
                      params={params}
                      config={config}
                      onApplyAIParams={(applied) => {
                        setParams(applied);
                        setCalcMode('standard');
                      }}
                    />
                  </div>
                )}

              </div>

              {/* Right Column: Live Estimate & Transparent Arguments */}
              <div className="lg:col-span-5 space-y-6 sticky top-20">
                
                {/* 1. Main Hero Price Display */}
                <PriceDisplay
                  result={result}
                  onOpenQuote={() => setIsQuoteModalOpen(true)}
                  onOpenComparison={() => setActiveTab('comparison')}
                  onSaveProject={handleSaveCurrentProject}
                  isSaved={isSavedRecently}
                />

                {/* 2. Why This Price? Argumentation for Call */}
                <WhyThisPrice result={result} />

                {/* 3. Cost Breakdown Progress Bars */}
                <CostBreakdown result={result} />

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Scenario Comparison (Basic / Standard / Premium) */}
        {activeTab === 'comparison' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
            <TierComparisonView
              comparison={tierComparison}
              onSelectTier={handleSelectTier}
            />
          </div>
        )}

        {/* TAB 3: History */}
        {activeTab === 'history' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
            <ProjectHistoryList
              projects={savedProjects}
              onLoadProject={handleLoadProject}
              onDeleteProject={handleDeleteProject}
              onImportProjects={handleImportProjects}
            />
          </div>
        )}

        {/* TAB 4: Settings */}
        {activeTab === 'settings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shadow-xl">
            <PricingSettingsForm
              config={config}
              onSaveConfig={handleSaveConfig}
              onResetToDefaults={handleResetConfig}
            />
          </div>
        )}

      </main>

      {/* Client Quote Modal */}
      {isQuoteModalOpen && (
        <ClientQuoteModal
          quote={clientQuote}
          onClose={() => setIsQuoteModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {DMITRY_DIMA_STUDIO.name} • Манифест: «{DMITRY_DIMA_STUDIO.manifest}»
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://t.me/${DMITRY_DIMA_STUDIO.leadDmitry.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Telegram Дмитрия: {DMITRY_DIMA_STUDIO.leadDmitry.telegram}
            </a>
            <span>•</span>
            <a
              href={`https://t.me/${DMITRY_DIMA_STUDIO.architectDima.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Telegram Димы: {DMITRY_DIMA_STUDIO.architectDima.telegram}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
