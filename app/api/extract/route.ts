import { NextResponse } from "next/server";
import { z } from "zod";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);
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
