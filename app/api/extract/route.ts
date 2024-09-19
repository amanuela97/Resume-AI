import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import puppeteer, { Browser } from "puppeteer-core";
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
    let browser: Browser;
    if (isLocal) {
      // if we are running locally, use the puppeteer that is installed in the node_modules folder
      browser = await require("puppeteer").launch();
    } else {
      // if we are running in AWS, download and use a compatible version of chromium at runtime
      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        executablePath: await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar`
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    }
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 9000)
    );

    const page = await browser.newPage();
    console.log(await page.browser().version());
    const fetchDataPromise = page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    await Promise.race([timeoutPromise, fetchDataPromise]);
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

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
