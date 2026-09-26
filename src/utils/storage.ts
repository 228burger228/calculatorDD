import { PricingConfig, ProjectParameters } from '../types/pricing';
import { SavedProject } from '../types/history';
import { DEFAULT_PRICING_CONFIG, INITIAL_PROJECT_PARAMETERS } from '../config/defaultPricing';

const STORAGE_KEYS = {
  PRICING_CONFIG: 'agy_dnd_pricing_config_v4_1',
  PROJECT_PARAMETERS: 'agy_dnd_current_params_v4_1',
  SAVED_PROJECTS: 'agy_dnd_saved_projects_v4',
  GEMINI_API_KEY: 'agy_gemini_api_key_v4',
};

export function loadPricingConfig(): PricingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING_CONFIG);
    if (!raw) return DEFAULT_PRICING_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PRICING_CONFIG,
      ...parsed,
      baseRates: { ...DEFAULT_PRICING_CONFIG.baseRates, ...parsed.baseRates },
      additionalWorks: { ...DEFAULT_PRICING_CONFIG.additionalWorks, ...parsed.additionalWorks },
      complexityMultipliers: { ...DEFAULT_PRICING_CONFIG.complexityMultipliers, ...parsed.complexityMultipliers },
      urgencyMultipliers: { ...DEFAULT_PRICING_CONFIG.urgencyMultipliers, ...parsed.urgencyMultipliers },
    };
  } catch (e) {
    console.warn('Failed to load pricing config from storage', e);
    return DEFAULT_PRICING_CONFIG;
  }
}

export function savePricingConfig(config: PricingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save pricing config to storage', e);
  }
}

export function resetPricingConfig(): PricingConfig {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRICING_CONFIG);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PRICING_CONFIG;
}

export function loadSavedProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load saved projects', e);
    return [];
  }
}

export function saveProjectToHistory(project: SavedProject): SavedProject[] {
  const existing = loadSavedProjects();
  const index = existing.findIndex((p) => p.id === project.id);
  let updated: SavedProject[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...project, updatedAt: new Date().toISOString() }, ...existing];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save project to history', e);
  }
  return updated;
}

export function deleteProjectFromHistory(id: string): SavedProject[] {
  const existing = loadSavedProjects();
  const updated = existing.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete project', e);
  }
  return updated;
}

export function loadLastParameters(): ProjectParameters {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECT_PARAMETERS);
    if (!raw) return INITIAL_PROJECT_PARAMETERS;
    return { ...INITIAL_PROJECT_PARAMETERS, ...JSON.parse(raw) };
  } catch (e) {
    return INITIAL_PROJECT_PARAMETERS;
  }
}

export function saveLastParameters(params: ProjectParameters): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECT_PARAMETERS, JSON.stringify(params));
  } catch (e) {
    console.error('Failed to save current parameters', e);
  }
}

export function loadApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save API key', e);
  }
}
