/**
 * Text Extractor for RAG Document Ingestion Pipeline
 * Extracts raw text from PDF, TXT, DOCX, and Markdown files.
 */

export async function extractTextFromFile(fileBuffer, fileName, mimeType = '') {
  const name = fileName.toLowerCase();
  
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.json') || mimeType.includes('text')) {
    return fileBuffer.toString('utf-8');
  }

  if (name.endsWith('.pdf') || mimeType.includes('pdf')) {
    try {
      // Basic text extraction for PDF buffers
      const rawText = fileBuffer.toString('utf-8');
      
      // Extract visible string tokens from PDF stream (fallback parser)
      const matches = rawText.match(/\(([^()]+)\)\s*TJ/g) || rawText.match(/\(([^()]+)\)/g);
      if (matches && matches.length > 5) {
        const cleaned = matches
          .map(m => m.replace(/^[()]+|[()TJ\s]+$/g, ''))
          .filter(str => str.length > 2)
          .join(' ');
        if (cleaned.length > 50) return cleaned;
      }

      // Plaintext search inside PDF stream
      const printable = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      const words = printable.split(/\s+/).filter(w => w.length > 2);
      if (words.length > 20) {
        return words.join(' ');
      }
    } catch (e) {
      console.warn('[TextExtractor] PDF parse warning:', e.message);
    }
    return fileBuffer.toString('utf-8');
  }

  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    // Basic XML text extraction from DOCX buffer
    try {
      const str = fileBuffer.toString('utf-8');
      const textMatches = str.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (textMatches) {
        return textMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
      }
    } catch (e) {
      console.warn('[TextExtractor] DOCX parse warning:', e.message);
    }
  }

  return fileBuffer.toString('utf-8');
}
