import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";

const opts = {
  centered: true,
  fileType: "docx" as const,
  getSize: function (img: Buffer): [number, number] {
    return [150, 150]; // Return width and height
  },
};

export async function POST(req: Request) {
  try {
    // Use request.formData() to extract form data directly
    const formData = await req.formData();

    // Convert FormData to a plain object
    const fields: Record<string, string> = {};
    const files: Record<string, File> = {};

    // Convert FormData entries to an array and iterate over them
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (value instanceof File) {
        files[key] = value;
      } else {
        fields[key] = value as string;
      }
    }

    const parseFields = (resumeInfo: any) => {
      const {
        education,
        workExperience,
        skills,
        interests,
        certifications,
        projects,
        volunteerExperience,
        awards,
        references,
      } = resumeInfo;
      return {
        ...resumeInfo,
        ...(education && { education: JSON.parse(education) }),
        ...(workExperience && { workExperience: JSON.parse(workExperience) }),
        ...(skills && { skills: JSON.parse(skills) }),
        ...(interests && { interests: JSON.parse(interests) }),
        ...(certifications && { certifications: JSON.parse(certifications) }),
        ...(projects && { projects: JSON.parse(projects) }),
        ...(volunteerExperience && {
          volunteerExperience: JSON.parse(volunteerExperience),
        }),
        ...(awards && { awards: JSON.parse(awards) }),
        ...(references && { references: JSON.parse(references) }),
      };
    };

    // Fetch .docx template from Firebase Storage using docxFileURL
    const docxFileURL = fields.template; // Assumes templateURL is sent in the form
    const fileResponse = await fetch(docxFileURL);
    const content = await fileResponse.arrayBuffer();

    // Create a zip of the docx content
    const zip = new PizZip(content);

    // Prepare data for docxtemplater
    let doc: Docxtemplater<PizZip>;
    if (files?.profileImage) {
      const arrayBuffer = await files.profileImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imageModule = new ImageModule({
        ...opts,
        getImage: () => buffer, // Use buffer from uploaded file
      });
      doc = new Docxtemplater(zip, {
        modules: [imageModule], // Register the image module
      });
      doc.setData({
        ...parseFields(fields),
        image: "path", // Ensure the correct data URI format
      });
    } else {
      doc = new Docxtemplater(zip);
      doc.setData({
        ...parseFields(fields),
      });
    }

    // Render the document with the new data
    doc.render();

    // Generate the final document as a buffer
    const docBuffer = doc.getZip().generate({ type: "nodebuffer" });

    // Set the response headers and return the document as a download
    return new Response(docBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=resume.docx",
      },
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
