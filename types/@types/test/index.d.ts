declare module "docx-pdf" {
  type DocxBuffer = Buffer | ArrayBuffer | Uint8Array | string;

  function docxConverter(
    input: DocxBuffer,
    callback: (error: Error | null, result: Buffer) => void
  ): string | Uint8Array;

  export default docxConverter;
}
