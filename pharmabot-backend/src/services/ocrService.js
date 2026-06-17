const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text') {
        console.log(`   OCR progress: ${Math.round(m.progress * 100)}%`);
      }
    }
  });

  return result.data.text.trim();
};

module.exports = { extractTextFromImage };