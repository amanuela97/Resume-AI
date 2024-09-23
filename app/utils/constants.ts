import { z } from "zod";

// Step 9: used to calculate the price based on GPT-3.5-turbo pricing ($0.0015 per 1k tokens)
export const PRICE_PER_THOUSAND_TOKENS = 0.0015;

export const JOB_DESCRIPTION_TEXT_LIMIT = 2800;

export const FILE_EXTENSIONS = [".pdf", ".docx"];

export const FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const analysisTemplate = `
      You are a job analyst. You will be given a candidate's resume (text) and a job description.
      Your job is to analyze how well the candidate fits the job.
      
      Resume: {resume}
      Job Description: {jobDescription}

      Provide a response in the following JSON format:
      {{
        "match_score": number (out of 100),
        "strengths": ["list of strengths"],
        "weaknesses": ["list of weaknesses"],
        "recommendation": string
      }}
    `;

export const coverLetterTemplate = `
  You are a professional cover letter writer. You will be given a candidate's resume (text) and a job description.
  Your job is to create a personalized cover letter that highlights the candidate's relevant skills and experiences for the position.

  Resume: {resume}
  Job Description: {jobDescription}

  Provide a response in the following JSON format:
  {{
    "introduction": "string (a brief introduction including the job position, company, and enthusiasm for applying)",
    "body": {{
        "relevant_experience": "string (highlight relevant experiences and achievements from the resume that align with the job description)",
        "skills_match": "string (discuss how the candidate's skills match the job requirements)",
        "cultural_fit": "string (explain how the candidate fits with the company's values, culture, or mission)",
        "motivation": "string (mention why the candidate is motivated to work for the company)"
    }},
    "conclusion": "string (closing remarks expressing interest and willingness for an interview, along with contact information)"
  }}
  `;

export const analysisSchema = z.object({
  match_score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendation: z.string(),
});

export const coverLetterSchema = z.object({
  introduction: z.string(),
  body: z.object({
    relevant_experience: z.string(),
    skills_match: z.string(),
    cultural_fit: z.string(),
    motivation: z.string(),
  }),
  conclusion: z.string(),
});
