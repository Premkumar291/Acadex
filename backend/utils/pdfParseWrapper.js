import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Create a wrapper function for pdfjs-dist (replacement for pdf-parse)
const pdfParseWrapper = async (dataBuffer, options = {}) => {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(dataBuffer),
      useSystemFonts: true,
      standardFontDataUrl: null
    });

    const pdfDocument = await loadingTask.promise;

    // Extract text from all pages
    let fullText = '';
    const numPages = pdfDocument.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // Return in the same format as pdf-parse for compatibility
    return {
      text: fullText,
      numpages: numPages,
      info: {},
      metadata: null,
      version: '1.0'
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};

export default pdfParseWrapper;
