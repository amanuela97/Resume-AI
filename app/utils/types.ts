export interface AnalysisResponseType {
  analysis: {
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
}

export interface CoverLetterResponseType {
  coverLetter: {
    introduction: string;
    body: {
      relevant_experience: String;
      skills_match: String;
      cultural_fit: String;
      motivation: String;
    };
    conclusion: string;
  };
}

export type Analysis = AnalysisResponseType[ContentType.analysis] & {
  id?: string;
  title?: string;
  userId?: string;
};

export type Analyses = Analysis[];

export enum ContentType {
  analysis = "analysis",
  coverLetter = "coverLetter",
}

export type CoverLetter = CoverLetterResponseType[ContentType.coverLetter] & {
  id?: string;
  title?: string;
  userId?: string;
};
