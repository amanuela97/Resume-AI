declare module "docxtemplater-image-module-free" {
  import Docxtemplater from "docxtemplater";

  interface ImageModuleOptions {
    getImage: (image: string) => Promise<string> | string;
    getSize: (
      image: string
    ) =>
      | Promise<{ width: number; height: number }>
      | { width: number; height: number };
  }

  export default class ImageModule {
    constructor(options?: ImageModuleOptions);
    // Add any other methods you might need
  }
}
