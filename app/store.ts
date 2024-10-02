import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Analyses,
  Analysis,
  CoverLetter,
  CustomUser,
  ResumeInfo,
  Review,
  TemplateMetada,
} from "./utils/types";

interface AppState {
  theme: "light" | "dark";
  hasHydrated: boolean;
  file: File | null;
  jobDescription: string;
  analysis: Analysis | null;
  analyses: Analyses; // Add analyses state
  coverLetter: CoverLetter | null;
  coverLetters: CoverLetter[];
  reviews: Review[];
  templates: TemplateMetada[];
  resumeInfo: ResumeInfo; // New state for resume information
  isLoading: boolean;
  isExtracting: boolean; // Add isExtracting state
  user: CustomUser | null;
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
  setUser: (user: CustomUser | null) => void;
  logoutUser: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  setTemplates: (templates: TemplateMetada[]) => void;
  setReviews: (reviews: Review[]) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      hasHydrated: false,
      file: null,
      jobDescription: "",
      analysis: null,
      analyses: [], // Initialize analyses as an empty array
      coverLetter: null,
      coverLetters: [],
      reviews: [],
      resumeInfo: {
        profileImage: null,
        fullName: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        careerObjective: "",
        education: [],
        workExperience: [],
        skills: [],
        certifications: [],
        projects: [],
        volunteerExperience: [],
        awards: [],
        references: [],
        interests: "",
      }, // Initialize resumeInfo
      isLoading: false,
      isExtracting: false, // Initialize isExtracting as false
      user: null, // Initialize user as null
      templates: [], // Initialize templates as an empty array
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
      setUser: (user: CustomUser | null) => set({ user }),
      logoutUser: () => {
        set({ user: null }); // Clear the user state
        localStorage.removeItem("app-storage"); // Manually remove the key from localStorage
      },
      setCoverLetter: (coverLetter: CoverLetter) => set({ coverLetter }),
      setCoverLetters: (coverLetters: CoverLetter[]) => set({ coverLetters }),
      setResumeInfo: (resumeInfo: ResumeInfo) => set({ resumeInfo }), // New setter
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }), // Setter for the hydration flag
      setTemplates: (templates: TemplateMetada[]) => set({ templates }), // Added setter for templates
      setReviews: (reviews: Review[]) => set({ reviews }), // Added setter for reviews
      setTheme: (theme: "light" | "dark") => set({ theme }),
    }),
    {
      name: "app-storage", // Unique key for localStorage
      partialize: (state) => ({
        theme: state?.theme,
        user: state?.user,
        templates: state?.templates,
        analyses: state?.analyses,
        coverLetters: state?.coverLetters,
        reviews: state?.reviews,
      }), // Only persist the user state
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
