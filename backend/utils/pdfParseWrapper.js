import PDFParser from 'pdf2json';

// Suppress pdf2json's "Setting up fake worker" warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Setting up fake worker')) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};

// Create a wrapper function for pdf2json (replacement for pdf-parse)
const pdfParseWrapper = async (dataBuffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      // Set up event handlers
      pdfParser.on('pdfParser_dataError', (errData) => {
        console.error('Error parsing PDF:', errData.parserError);
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          // Extract text from all pages
          let fullText = '';
          const numPages = pdfData.Pages ? pdfData.Pages.length : 0;

          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const text of page.Texts) {
                  if (text.R) {
                    for (const run of text.R) {
                      if (run.T) {
                        // Decode URI-encoded text
                        fullText += decodeURIComponent(run.T) + ' ';
                      }
                    }
                  }
                }
              }
              fullText += '\n';
            }
          }

          // Return in the same format as pdf-parse for compatibility
          resolve({
            text: fullText,
            numpages: numPages,
            info: pdfData.Meta || {},
            metadata: null,
            version: '1.0'
          });
        } catch (error) {
          reject(error);
        }
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(dataBuffer);
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};

export default pdfParseWrapper;
