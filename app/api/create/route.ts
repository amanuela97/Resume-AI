import { NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { LLMResult } from "@langchain/core/outputs";
import officeParser from "officeparser";
import {
  analysisSchema,
  analysisTemplate,
  coverLetterSchema,
  coverLetterTemplate,
  FILE_TYPES,
} from "@/app/utils/constants";
import fs from "fs";
import path from "path";
import { ContentType } from "@/app/utils/types";
import { getTokenCount } from "@/app/utils/helper";

const maxTokens = parseInt(process.env.NEXT_PUBLIC_MAX_TOKEN || "4000");
const tempDir = path.join("/tmp", "officeParserTemp", "tempfiles");

// Ensure the directory exists
fs.mkdirSync(tempDir, { recursive: true });

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
  const contentType = formData.get("contentType") as ContentType;

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
      const parsedFile = await officeParser.parseOfficeAsync(buffer, {
        tempFilesLocation: tempDir,
      });
      fileText = parsedFile;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const inputTokenCount = getTokenCount(fileText + " " + jobDescription);

    if (inputTokenCount > maxTokens) {
      return NextResponse.json(
        {
          error: `Input text is too long. Either reduce the length of the job description or upload a smaller file.`,
        },
        { status: 400 }
      );
    }

    // Step 2: Define a prompt using Langchain PromptTemplate
    const template = new PromptTemplate({
      template:
        contentType === ContentType.analysis
          ? analysisTemplate
          : coverLetterTemplate,
      inputVariables: ["resume", "jobDescription"],
    });

    // Step 3: Define the Zod schema for output validation
    const schema =
      contentType === ContentType.analysis ? analysisSchema : coverLetterSchema;

    // Step 4: Create the output parser using fromZodSchema
    const parser = StructuredOutputParser.fromZodSchema(schema);

    // Step 5: Generate the prompt
    const prompt = await template.format({ resume: fileText, jobDescription });

    // Step 6: Send the prompt to OpenAI using Langchain's OpenAI wrapper
    const llm = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      temperature: 0,
      maxTokens: 1000,
      streaming: true,
    });

    // Step 7: Return a ReadableStream to handle response streaming
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let responseText = "";

          // Create an async iterator for the streamed responses
          for await (const chunk of await llm.stream(prompt)) {
            const textChunk = chunk;
            responseText += textChunk;

            // Enqueue the chunk to the stream
            controller.enqueue(new TextEncoder().encode(textChunk));
          }

          // When streaming is complete, parse the full response
          const parsedResponse = await parser.parse(responseText);

          // Final result after all chunks have been processed
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({ [contentType]: parsedResponse })
            )
          );
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Analysis failed: " + error },
      { status: 500 }
    );
  }
}
