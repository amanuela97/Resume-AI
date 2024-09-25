import { FieldValue, Timestamp } from "firebase/firestore";

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
export type FireBaseDate = Timestamp | FieldValue;

export type Analysis = AnalysisResponseType[ContentType.analysis] & {
  id?: string;
  title?: string;
  userId?: string;
  updatedAt: FireBaseDate;
  createdAt: FireBaseDate;
};

export type Analyses = Analysis[];

export enum ContentType {
  analysis = "analysis",
  coverLetter = "coverLetter",
}

export type CoverLetter = {
  id: string;
  title: string;
  userId: string;
  content: string;
  updatedAt: FireBaseDate;
  createdAt: FireBaseDate;
};

export function isTimestamp(value: any): value is Timestamp {
  return value instanceof Timestamp;
}
