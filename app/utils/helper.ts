import { AnalysisResponseType } from "./types";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export const convertMessageContentToString = (result: any): string => {
  let contentString: string;
  if (typeof result.content === "string") {
    contentString = result.content;
  } else if (Array.isArray(result.content)) {
    contentString = result.content
      .map((item: any) =>
        typeof item === "string" ? item : JSON.stringify(item)
      )
      .join(" ");
  } else if (result.content === undefined) {
    throw new Error("Received undefined content from ChatOpenAI");
  } else {
    contentString = JSON.stringify(result.content);
  }
  return contentString;
};

export const docDefinition = (
  data: AnalysisResponseType["analysis"]
): TDocumentDefinitions => {
  return {
    content: [
      { text: "Candidate Resume Evaluation", style: "header" },
      { text: `Match Score: ${data.match_score}`, style: "subheader" },

      { text: "Strengths", style: "sectionHeader" },
      {
        ul: data.strengths.map((strength) => ({ text: strength })),
      },

      { text: "Weaknesses", style: "sectionHeader" },
      {
        ul: data.weaknesses.map((weakness) => ({ text: weakness })),
      },

      { text: "Recommendation", style: "sectionHeader" },
      { text: data.recommendation, margin: [0, 0, 0, 10] },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      defaultStyle: {
        fontSize: 12,
        margin: [0, 5, 0, 5],
      },
    },
  };
};

export const formatJsonToText = (
  jsonData: AnalysisResponseType["analysis"]
) => {
  let textContent = `Candidate Evaluation\n\n`;

  textContent += `Match Score: ${jsonData.match_score}\n\n`;

  textContent += `Strengths:\n`;
  jsonData.strengths.forEach((strength, index) => {
    textContent += `  ${index + 1}. ${strength}\n`;
  });

  textContent += `\nWeaknesses:\n`;
  jsonData.weaknesses.forEach((weakness, index) => {
    textContent += `  ${index + 1}. ${weakness}\n`;
  });

  textContent += `\nRecommendation:\n`;
  textContent += `  ${jsonData.recommendation}\n`;

  return textContent;
};
