import { NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { LLMResult } from "@langchain/core/outputs";
import officeParser from "officeparser";
import { z } from "zod";
import { FILE_TYPES } from "@/app/utils/constants";

export async function POST(request: Request) {
  // Check for OPENAI_API_KEY
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File; // Renamed to file for clarity
  const jobDescription = formData.get("jobDescription") as string;

  if (!file || !jobDescription) {
    return NextResponse.json(
      { error: "Missing file or job description" },
      { status: 400 }
    );
  }

  try {
    let fileText = "";

    // Step 1: Extract content based on file type
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (FILE_TYPES.includes(file.type)) {
      const parsedFile = await officeParser.parseOfficeAsync(buffer);
      fileText = parsedFile;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Step 2: Define a prompt using Langchain PromptTemplate
    const template = new PromptTemplate({
      template: `
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
    `,
      inputVariables: ["resume", "jobDescription"],
    });

    // Step 3: Define the Zod schema for output validation
    const schema = z.object({
      match_score: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      recommendation: z.string(),
    });

    // Step 4: Create the output parser using fromZodSchema
    const parser = StructuredOutputParser.fromZodSchema(schema);

    // Step 5: Generate the prompt
    const prompt = await template.format({ resume: fileText, jobDescription });

    // Step 6: Send the prompt to OpenAI using Langchain's OpenAI wrapper
    const llm = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0,
      maxTokens: 500,
    });

    // Use the 'generate' method to get the full LLMResult
    const result: LLMResult = await llm.generate([prompt]);

    // Step 7: Parse the response with the structured parser
    const parsedResponse = await parser.parse(result.generations[0][0].text);

    // Return the JSON result
    return NextResponse.json({
      analysis: parsedResponse,
    });
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Analysis failed: " + error },
      { status: 500 }
    );
  }
}
