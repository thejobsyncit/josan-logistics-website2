/**
 * Safely downloads a jsPDF instance as a guaranteed .pdf file across all modern browsers
 * (Chrome, Edge, Firefox, Safari) by ensuring:
 * 1. Correct 'application/pdf' MIME type Blob
 * 2. Strict .pdf filename
 * 3. Anchor element is appended to document.body before click(), which is mandatory in Chromium/Edge
 *    so the browser does not strip the filename and download a raw UUID blob without an extension.
 */
export const safeDownloadPdf = (doc, rawFilename) => {
  const filename = rawFilename.toLowerCase().endsWith('.pdf') 
    ? rawFilename 
    : `${rawFilename}.pdf`;

  try {
    const blobOutput = doc.output('blob');
    const pdfBlob = new Blob([blobOutput], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    link.setAttribute('download', filename);

    // CRITICAL: Chromium/Edge requires the link in DOM to respect download attribute
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    }, 2000);

    return true;
  } catch (err) {
    console.error('Safe PDF download error, attempting fallback:', err);
    try {
      doc.save(filename);
      return true;
    } catch (saveErr) {
      console.error('doc.save fallback failed:', saveErr);
      return false;
    }
  }
};

export const openPdfInNewTab = (doc) => {
  try {
    const blobOutput = doc.output('blob');
    const pdfBlob = new Blob([blobOutput], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
    return true;
  } catch (err) {
    console.error('Failed to open PDF in new tab:', err);
    return false;
  }
};
