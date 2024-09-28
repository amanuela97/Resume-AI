import { FieldValue, Timestamp } from "firebase/firestore";

export interface ColorOption {
  value: string;
  label: string;
}

export type uploadTemplateProp = {
  name: string;
  previewImage: File;
  colorsArray: string[];
  docxFile: File;
};

export type TemplateMetada = {
  id: string;
  name: string;
  previewImageURL: string;
  colors: string[];
  docxFileURL: string;
};

export type CustomUser = {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  uid: string;
  providerId: string;
  creationTime: string | undefined;
  lastSignInTime: string | undefined;
  phoneNumber: string | null;
  role: string;
};

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

export type ResumeInfo = {
  profileImage: File | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  careerObjective: string;
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;
    honors: string;
  }[];
  workExperience: {
    jobTitle: string;
    companyName: string;
    employmentDates: string;
    responsibilities: string;
    achievements: string;
    location: string;
  }[];
  skills: {
    skillName: string;
    skillLevel: string;
  }[];
  certifications: {
    certificationName: string;
    issuingOrganization: string;
    dateEarned: string;
  }[];
  projects: {
    projectName: string;
    projectDescription: string;
    keyTechnologies: string;
    projectDuration: string;
  }[];
  volunteerExperience: {
    volunteerOrg: string;
    volunteerRole: string;
    volunteerDuration: string;
    volunteerResponsibilities: string;
  }[];
  awards: {
    awardName: string;
    awardOrg: string;
    dateReceived: string;
  }[];
  references: {
    refereeName: string;
    refereeJobTitle: string;
    refereeCompany: string;
    refereeContact: string;
  }[];
  interests: string;
};

export type Section = keyof ResumeInfo;
