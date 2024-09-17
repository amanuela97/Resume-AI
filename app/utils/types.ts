export interface AnalysisResponseType {
  analysis: {
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
}

export type Analysis = AnalysisResponseType["analysis"] & {
  id: string;
  name: string;
  userId: string;
};

export enum ExtractionStatusType {
  idle = "idle",
  success = "success",
  fail = "fail",
}

export type Analyses = Analysis[];
