import { create } from "zustand";
import { Analyses, Analysis } from "./utils/types";
import { User } from "firebase/auth";

interface AppState {
  file: File | null;
  jobDescription: string;
  analysis: Analysis | null;
  analyses: Analyses; // Add analyses state
  isLoading: boolean;
  isExtracting: boolean; // Add isExtracting state
  user: User | null;
  setFile: (file: File | null) => void;
  setJobDescription: (description: string) => void;
  setAnalysis: (analysis: Analysis | null) => void;
  setAnalyses: (analyses: Analysis[]) => void; // Add setAnalyses action
  deleteAnalysis: (id: string) => void; // Add deleteAnalysis action
  setIsLoading: (isLoading: boolean) => void;
  setIsExtracting: (isExtracting: boolean) => void; // Add setIsExtracting action
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  file: null,
  jobDescription: "",
  analysis: null,
  analyses: [], // Initialize analyses as an empty array
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
    })), // Implement deleteAnalysis action
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsExtracting: (isExtracting: boolean) => set({ isExtracting }), // Implement setIsExtracting action
  setUser: (user: User | null) => set({ user }),
}));
