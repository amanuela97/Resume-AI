import { create } from "zustand";
import { Analyses, Analysis } from "./utils/types";
import { User } from "firebase/auth";
import { CoverLetter } from "@/app/utils/types";

interface AppState {
  file: File | null;
  jobDescription: string;
  analysis: Analysis | null;
  analyses: Analyses; // Add analyses state
  coverLetter: CoverLetter | null;
  coverLetters: CoverLetter[];
  isLoading: boolean;
  isExtracting: boolean; // Add isExtracting state
  user: User | null;
  setFile: (file: File | null) => void;
  setJobDescription: (description: string) => void;
  setCoverLetter: (coverLetter: CoverLetter) => void;
  setCoverLetters: (coverLetters: CoverLetter[]) => void;
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
}));
