export interface Standard {
  id: string;
  asnIdentifier: string;
  position: number;
  depth: number;
  description: string;
  statementLabel?: string;
  listId?: string;
}

export interface StandardSet {
  id: string;
  title: string;
  subject: string;
  educationLevels: string[];
  document: {
    id: string;
    valid: string;
    title: string;
    sourceURL: string | null;
    asnIdentifier: string;
    publicationStatus: string;
  };
  jurisdiction: {
    id: string;
    title: string;
  };
  standards: Record<string, Standard>;
}

export interface StandardOption {
  label: string;
  value: string;
  standards: Record<string, Standard>;
} 