const { PDFParse } = require("pdf-parse");

class PdfService {
  async extract(buffer: Buffer) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    return result.text.trim();
  }
}

export const pdfService = new PdfService();
