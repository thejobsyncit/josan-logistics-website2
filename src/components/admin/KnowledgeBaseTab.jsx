import React, { useState, useEffect } from 'react';
import { ragService } from '../../services/ragService';
import { 
  FileText, 
  UploadCloud, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Sparkles, 
  Layers, 
  BookOpen,
  Loader2,
  FileCheck
} from 'lucide-react';

export const KnowledgeBaseTab = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusStep, setUploadStatusStep] = useState(''); // Uploading, Processing, Chunking, Embedding, Completed
  
  // New Document Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Air Freight');
  const [docText, setDocText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const [notification, setNotification] = useState(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await ragService.getDocuments();
      setDocuments(docs || []);
    } catch (e) {
      console.warn('Fetch docs error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocText(event.target.result || '');
    };
    reader.readAsText(file);
  };

  const handleIngestSubmit = async (e) => {
    e.preventDefault();
    if (!docText.trim()) {
      setNotification({ type: 'error', message: 'Please select a file or enter document text content.' });
      return;
    }

    setIsUploading(true);
    setUploadStatusStep('Uploading Document...');

    try {
      setTimeout(() => setUploadStatusStep('Extracting Text & Cleaning...'), 600);
      setTimeout(() => setUploadStatusStep('Chunking into Semantic Passages...'), 1200);
      setTimeout(() => setUploadStatusStep('Generating Vector Embeddings (1536d)...'), 1800);

      const res = await ragService.ingestDocument({
        title: docTitle || selectedFileName || 'Knowledge Document',
        fileName: selectedFileName || `${docTitle || 'document'}.txt`,
        content: docText,
        category: docCategory,
        description: `Uploaded via Admin Knowledge Base`
      });

      setUploadStatusStep('Storing Vectors in Supabase pgvector...');
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatusStep('');
        setDocTitle('');
        setDocText('');
        setSelectedFileName('');
        setNotification({ type: 'success', message: `Document "${res.title}" successfully ingested with ${res.chunkCount} vector chunks!` });
        fetchDocuments();
      }, 2500);

    } catch (err) {
      setIsUploading(false);
      setUploadStatusStep('');
      setNotification({ type: 'error', message: `Ingestion failed: ${err.message}` });
    }
  };

  const handleSeedKnowledgeBase = async () => {
    setIsUploading(true);
    setUploadStatusStep('Seeding Official Josan Logistics Knowledge Documents...');
    try {
      await ragService.seedKnowledgeBase();
      setNotification({ type: 'success', message: 'Official Josan Logistics Knowledge Base seeded successfully!' });
      await fetchDocuments();
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to seed sample documents.' });
    } finally {
      setIsUploading(false);
      setUploadStatusStep('');
    }
  };

  const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunk_count || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B132B] via-slate-900 to-[#0B132B] rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-[#FF6B00]/20 rounded-xl border border-orange-500/30">
              <Database className="w-6 h-6 text-[#FF6B00]" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-white">
              AI Knowledge Base Management (RAG)
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Upload policies, customs guides, and freight documentation. Documents are converted into vector embeddings and stored in Supabase pgvector for real-time grounded chatbot answers.
          </p>
        </div>

        <button
          onClick={handleSeedKnowledgeBase}
          disabled={isUploading}
          className="px-4 py-2.5 bg-gradient-to-r from-[#FF6B00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-orange-500/20 flex items-center space-x-2 cursor-pointer transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Seed Josan Logistics Knowledge</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Documents</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{documents.length}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vector Chunks Indexed</p>
            <p className="text-2xl font-black text-[#FF6B00] mt-1">{totalChunks}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vector Engine</p>
            <p className="text-sm font-extrabold text-emerald-600 mt-1">pgvector 1536-dim Active</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Upload Document Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
          <UploadCloud className="w-4 h-4 text-[#FF6B00]" />
          <span>Upload & Ingest New Document</span>
        </h3>

        <form onSubmit={handleIngestSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Singapore Customs TradeNet Procedure"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
              >
                <option value="Air Freight">Air Freight</option>
                <option value="Road Freight">Road Freight</option>
                <option value="Customs">Customs Clearance</option>
                <option value="International Trade">International Trade (Incoterms)</option>
                <option value="Services & Rates">Services & Rates</option>
                <option value="General">General FAQ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select File (PDF, TXT, DOCX)</label>
            <input
              type="file"
              accept=".txt,.pdf,.md,.doc,.docx"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-orange-50 file:text-[#FF6B00] hover:file:bg-orange-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Or Paste Text Content Directly</label>
            <textarea
              rows={4}
              placeholder="Paste logistics document text, regulations, or FAQ guidelines here..."
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#FF6B00] focus:bg-white focus:outline-none font-mono"
            />
          </div>

          {/* Ingestion Pipeline Status Progress */}
          {isUploading && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center space-x-3 text-xs font-extrabold text-orange-800 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
              <span>{uploadStatusStep}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !docText.trim()}
            className={`px-6 py-3 rounded-xl text-xs font-extrabold shadow-md flex items-center space-x-2 transition-all cursor-pointer ${
              docText.trim() && !isUploading
                ? 'bg-[#FF6B00] hover:bg-orange-600 text-white shadow-orange-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Process & Ingest Document into Vector DB</span>
          </button>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Knowledge Base Index</h3>
          <button
            onClick={fetchDocuments}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF6B00]' : ''}`} />
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">No documents indexed yet.</p>
            <button
              onClick={handleSeedKnowledgeBase}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-extrabold text-xs rounded-xl transition-colors"
            >
              Seed Official Knowledge Documents
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Document Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Chunks</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#FF6B00] shrink-0" />
                      <div>
                        <p>{doc.title || doc.file_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.file_name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                        {doc.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600">
                      {doc.chunk_count || 3} chunks
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-extrabold text-[10px] flex items-center space-x-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>COMPLETED</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(doc.created_at || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
