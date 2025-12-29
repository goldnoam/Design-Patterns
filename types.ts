
export enum PatternCategory {
  CREATIONAL = 'Creational',
  STRUCTURAL = 'Structural',
  BEHAVIORAL = 'Behavioral'
}

export interface DesignPattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  whenToUse: string[];
  pros: string[];
  cons: string[];
  codeExample: string;
}

export interface SuggestionResult {
  patternId: string;
  reasoning: string;
}
