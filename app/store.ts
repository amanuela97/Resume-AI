import { create } from "zustand";
import { Analyses, Analysis, CoverLetter, ResumeInfo } from "./utils/types";
import { User } from "firebase/auth";

interface AppState {
  file: File | null;
  jobDescription: string;
  analysis: Analysis | null;
  analyses: Analyses; // Add analyses state
  coverLetter: CoverLetter | null;
  coverLetters: CoverLetter[];
  resumeInfo: ResumeInfo; // New state for resume information
  isLoading: boolean;
  isExtracting: boolean; // Add isExtracting state
  user: User | null;
  setFile: (file: File | null) => void;
  setJobDescription: (description: string) => void;
  setCoverLetter: (coverLetter: CoverLetter) => void;
  setCoverLetters: (coverLetters: CoverLetter[]) => void;
  setResumeInfo: (resumeInfo: ResumeInfo) => void; // New setter for resume information
  setAnalysis: (analysis: Analysis | null) => void;
  setAnalyses: (analyses: Analysis[]) => void; // Add setAnalyses action
  deleteAnalysis: (id: string) => void; // Add deleteAnalysis action
  deleteCoverLetter: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsExtracting: (isExtracting: boolean) => void; // Add setIsExtracting action
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  file: null,
  jobDescription: "",
  analysis: null,
  analyses: [], // Initialize analyses as an empty array
  coverLetter: null,
  coverLetters: [],
  resumeInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    careerObjective: "",
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        graduationDate: "",
        honors: "",
      },
    ],
    workExperience: [
      {
        jobTitle: "",
        companyName: "",
        employmentDates: "",
        responsibilities: "",
        achievements: "",
        location: "",
      },
    ],
    skills: [{ skillName: "", skillLevel: "" }],
    certifications: [
      { certificationName: "", issuingOrganization: "", dateEarned: "" },
    ],
    projects: [
      {
        projectName: "",
        projectDescription: "",
        keyTechnologies: "",
        projectDuration: "",
      },
    ],
    volunteerExperience: [
      {
        volunteerOrg: "",
        volunteerRole: "",
        volunteerDuration: "",
        volunteerResponsibilities: "",
      },
    ],
    awards: [{ awardName: "", awardOrg: "", dateReceived: "" }],
    references: [
      {
        refereeName: "",
        refereeJobTitle: "",
        refereeCompany: "",
        refereeContact: "",
      },
    ],
    interests: "",
  }, // Initialize resumeInfo
  isLoading: false,
  isExtracting: false, // Initialize isExtracting as false
  user: null, // Initialize user as null
  setFile: (file: File | null) => set({ file }),
  setJobDescription: (jobDescription: string) => set({ jobDescription }),
  setAnalysis: (analysis) => set({ analysis }),
  setAnalyses: (analyses) => set({ analyses }), // Implement setAnalyses action
  deleteAnalysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((analysis) => analysis.id !== id),
    })),
  deleteCoverLetter: (id) =>
    set((state) => ({
      coverLetters: state.coverLetters.filter(
        (coverLetter) => coverLetter.id !== id
      ),
    })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsExtracting: (isExtracting: boolean) => set({ isExtracting }), // Implement setIsExtracting action
  setUser: (user: User | null) => set({ user }),
  setCoverLetter: (coverLetter: CoverLetter) => set({ coverLetter }),
  setCoverLetters: (coverLetters: CoverLetter[]) => set({ coverLetters }),
  setResumeInfo: (resumeInfo: ResumeInfo) => set({ resumeInfo }), // New setter
}));
