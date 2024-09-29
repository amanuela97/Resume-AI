import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

const urlSchema = z.string().url();

export async function POST(request: Request) {
  const formData = await request.formData();
  const url = formData.get("url") as string;

  try {
    urlSchema.parse(url);
  } catch (error) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `http://api.scraperapi.com?api_key=${process.env.SCRAPE_API_KEY}&url=${url}`
    );
    const html = await response.text();

    const $ = cheerio.load(html);
    let text = $("body").text();
    text = text.replace(/\s+/g, " ").trim();
    text = text.substring(0, 2800); // Extract up to 2800 characters

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error extracting text:", error);
    return NextResponse.json(
      { error: "Failed to extract text" },
      { status: 500 }
    );
  }
}
