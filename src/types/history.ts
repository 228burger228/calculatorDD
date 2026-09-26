import { ProjectParameters, CalculationResult } from './pricing';

export interface SavedProject {
  id: string;
  name: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  parameters: ProjectParameters;
  result: CalculationResult;
  quoteText?: string;
  status: 'draft' | 'sent_to_client' | 'negotiation' | 'approved' | 'in_development' | 'completed';
}
