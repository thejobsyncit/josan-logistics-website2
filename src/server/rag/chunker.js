/**
 * Document Chunker for RAG Pipeline
 * Splits documents into overlapping semantic chunks with rich metadata.
 */

export function chunkDocument(text, options = {}) {
  const {
    chunkSize = 600,
    chunkOverlap = 120,
    documentId = null,
    fileName = 'document.txt'
  } = options;

  if (!text || typeof text !== 'string') return [];

  // Clean raw text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into paragraphs or sentences
  const paragraphs = cleanedText.split(/\n\n+/);
  const chunks = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length <= chunkSize) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
    } else {
      if (currentChunk.trim().length > 0) {
        chunks.push(createChunkObj(currentChunk, chunkIndex++, documentId, fileName));
      }

      // Handle paragraph larger than chunkSize
      if (para.length > chunkSize) {
        let start = 0;
        while (start < para.length) {
          const end = Math.min(start + chunkSize, para.length);
          const segment = para.slice(start, end);
          chunks.push(createChunkObj(segment, chunkIndex++, documentId, fileName));
          start += (chunkSize - chunkOverlap);
        }
        currentChunk = '';
      } else {
        // Carry over overlap
        const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
        const overlap = currentChunk.slice(overlapStart);
        currentChunk = overlap ? `${overlap}\n\n${para}` : para;
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(createChunkObj(currentChunk, chunkIndex++, documentId, fileName));
  }

  return chunks;
}

function createChunkObj(content, index, documentId, fileName) {
  // Estimate page number based on chunk index (~1000 characters per page)
  const estimatedPage = Math.floor(index * 0.6) + 1;

  // Extract section header if present
  const lines = content.trim().split('\n');
  let header = '';
  if (lines[0] && lines[0].length < 60 && (lines[0].endsWith(':') || lines[0] === lines[0].toUpperCase() || lines[0].startsWith('#'))) {
    header = lines[0].replace(/^#+\s*/, '');
  }

  return {
    chunkIndex: index,
    content: content.trim(),
    tokenCount: Math.ceil(content.length / 4),
    metadata: {
      document_id: documentId,
      file_name: fileName,
      chunk_index: index,
      page: estimatedPage,
      section_header: header || null
    }
  };
}
