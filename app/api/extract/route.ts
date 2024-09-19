import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

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
    const isLocal = process.env.LOCAL_ENV;
    let browser;
    if (isLocal) {
      console.log("local");
      // if we are running locally, use the puppeteer that is installed in the node_modules folder
      browser = await require("puppeteer").launch();
    } else {
      // if we are running in AWS, download and use a compatible version of chromium at runtime
      console.log("serverless");
      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar`
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    }
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
