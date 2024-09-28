declare module "docxtemplater-image-module-free" {
  import Docxtemplater from "docxtemplater";

  // Options interface for the ImageModule
  interface ImageModuleOptions {
    centered?: boolean; // Option to center images
    fileType: "docx" | "pptx"; // Type of the document (docx or pptx)

    // Function to load the image
    getImage(tagValue: string, tagName: string): Buffer | Uint8Array;

    // Function to get image size
    getSize(
      img: Buffer | Uint8Array,
      tagValue: string,
      tagName: string
    ): [number, number];
  }

  // ImageModule class definition
  class ImageModule {
    constructor(options: ImageModuleOptions);
  }

  export = ImageModule;
}
