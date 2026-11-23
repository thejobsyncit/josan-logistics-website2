import React, { useState, useEffect } from 'react';
import { ragService } from '../../services/ragService';
import { matchQuestion, MIN_CONFIDENCE_THRESHOLD } from '../../server/faqMatcher';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Search, 
  Bot, 
  Send, 
  Sliders, 
  RefreshCw,
  Eye,
  EyeOff,
  Inbox,
  ArrowRight,
  X,
  FileQuestion,
  Tag,
  Check
} from 'lucide-react';

export const KnowledgeBaseTab = () => {
  const [faqs, setFaqs] = useState([]);
  const [unanswered, setUnanswered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'unanswered' | 'sandbox'
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State for Add / Edit FAQ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    id: '',
    category: 'Booking & Quotes',
    mainQuestion: '',
    alternativeQuestions: '',
    keywords: '',
    approvedAnswer: '',
    hasQuoteAction: false,
    isActive: true
  });

  // Sandbox Test State
  const [testQuery, setTestQuery] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedFaqs, fetchedUnanswered] = await Promise.all([
        ragService.getFaqs(),
        ragService.getUnansweredQuestions()
      ]);
      setFaqs(fetchedFaqs || []);
      setUnanswered(fetchedUnanswered || []);
    } catch (err) {
      console.warn('Error loading FAQ data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open modal to add new FAQ
  const handleOpenAdd = (prefillQuestion = '') => {
    setEditingFaq(null);
    setFaqForm({
      id: `faq_${Date.now()}`,
      category: 'Booking & Quotes',
      mainQuestion: prefillQuestion,
      alternativeQuestions: '',
      keywords: '',
      approvedAnswer: '',
      hasQuoteAction: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing FAQ
  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      id: faq.id,
      category: faq.category || 'General',
      mainQuestion: faq.mainQuestion || '',
      alternativeQuestions: (faq.alternativeQuestions || []).join('\n'),
      keywords: (faq.keywords || []).join(', '),
      approvedAnswer: faq.approvedAnswer || '',
      hasQuoteAction: Boolean(faq.hasQuoteAction),
      isActive: faq.isActive !== undefined ? faq.isActive : true
    });
    setIsModalOpen(true);
  };

  // Save (Create or Update) FAQ
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqForm.mainQuestion.trim() || !faqForm.approvedAnswer.trim()) {
      showNotification('Main question and approved answer are required.', 'error');
      return;
    }

    const payload = {
      category: faqForm.category,
      mainQuestion: faqForm.mainQuestion.trim(),
      alternativeQuestions: faqForm.alternativeQuestions
        .split('\n')
        .map(q => q.trim())
        .filter(Boolean),
      keywords: faqForm.keywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean),
      approvedAnswer: faqForm.approvedAnswer.trim(),
      hasQuoteAction: Boolean(faqForm.hasQuoteAction),
      isActive: Boolean(faqForm.isActive)
    };

    try {
      if (editingFaq) {
        await ragService.updateFaq(editingFaq.id, payload);
        showNotification('FAQ updated successfully.');
      } else {
        await ragService.addFaq({ id: faqForm.id, ...payload });
        showNotification('New FAQ added successfully.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showNotification(`Failed to save FAQ: ${err.message}`, 'error');
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await ragService.deleteFaq(id);
      showNotification('FAQ deleted successfully.');
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      showNotification('Failed to delete FAQ.', 'error');
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleActive = async (faq) => {
    const updatedStatus = !faq.isActive;
    try {
      await ragService.updateFaq(faq.id, { isActive: updatedStatus });
      setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, isActive: updatedStatus } : f));
      showNotification(`FAQ marked as ${updatedStatus ? 'Active' : 'Inactive'}.`);
    } catch (err) {
      showNotification('Failed to update status.', 'error');
    }
  };

  // Dismiss Unanswered Log
  const handleDeleteUnanswered = async (id) => {
    try {
      await ragService.deleteUnansweredQuestion(id);
      setUnanswered(prev => prev.filter(item => item.id !== id));
      showNotification('Inquiry dismissed.');
    } catch (err) {
      showNotification('Failed to dismiss inquiry.', 'error');
    }
  };

  // Sandbox Test Match
  const handleRunTest = (overrideQuery) => {
    const query = (overrideQuery || testQuery || '').trim();
    if (!query) return;

    if (overrideQuery) {
      setTestQuery(overrideQuery);
    }

    setIsTesting(true);
    setTimeout(() => {
      const activeFaqs = faqs.filter(f => f.isActive !== false);
      const result = matchQuestion(query, activeFaqs);

      setTestResult({
        query,
        ...result,
        timestamp: new Date().toLocaleTimeString()
      });
      setIsTesting(false);
    }, 150);
  };

  const categories = ['ALL', ...new Set(faqs.map(f => f.category || 'General'))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = categoryFilter === 'ALL' || faq.category === categoryFilter;
    const matchesSearch = !searchFilter.trim() || 
      faq.mainQuestion.toLowerCase().includes(searchFilter.toLowerCase()) ||
      faq.approvedAnswer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (faq.keywords || []).some(k => k.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (faq.alternativeQuestions || []).some(a => a.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeFaqsCount = faqs.filter(f => f.isActive !== false).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0B132B] via-slate-900 to-[#0B132B] rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-[#FF6B00]/20 rounded-xl border border-orange-500/30">
              <Database className="w-5 h-5 text-[#FF6B00]" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-white">
              Chatbot FAQ Knowledge Base Management
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Maintain Josan Logistics' approved company responses. Powered by a deterministic rule-based matching engine with spelling-error tolerance, synonym matching, and alternative question phrasings.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="px-4 py-2.5 bg-gradient-to-r from-[#FF6B00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-orange-500/20 flex items-center space-x-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* 2. Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-fade-in ${
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

      {/* 3. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active FAQs</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{activeFaqsCount} / {faqs.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</p>
            <p className="text-2xl font-black text-[#FF6B00] mt-1">{categories.length - 1}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unanswered Inquiries</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{unanswered.length}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engine Status</p>
            <p className="text-xs font-black text-blue-600 mt-1">Rule-Based Active</p>
            <p className="text-[10px] text-slate-400 font-medium">Zero-API Dependent</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'faqs'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
          <span>Approved FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Live Matching Tester</span>
        </button>

        <button
          onClick={() => setActiveTab('unanswered')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'unanswered'
              ? 'bg-[#0B132B] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Inbox className="w-4 h-4 text-amber-500" />
          <span>Unanswered Customer Inquiries ({unanswered.length})</span>
        </button>
      </div>

      {/* 5. TAB CONTENT: APPROVED FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs, answers, keywords..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                ))}
              </select>

              <button
                onClick={loadData}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                title="Refresh FAQs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF6B00]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No FAQs match your search.</p>
              <button
                onClick={() => handleOpenAdd()}
                className="px-4 py-2 bg-orange-50 text-[#FF6B00] rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
              >
                Create new FAQ
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Question &amp; Approved Answer</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Alternatives</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredFaqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 max-w-md">
                        <p className="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5">
                          <span>{faq.mainQuestion}</span>
                          {faq.hasQuoteAction && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-[#FF6B00] rounded text-[9px] font-bold">
                              Quote Button
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {faq.approvedAnswer}
                        </p>
                        {faq.keywords && faq.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {faq.keywords.slice(0, 5).map((kw, ki) => (
                              <span key={ki} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-mono">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold text-[10px]">
                          {faq.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-slate-600 font-bold text-[11px]">
                          {(faq.alternativeQuestions || []).length} phrasings
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(faq)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                            faq.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {faq.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{faq.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(faq)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                            title="Edit FAQ"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: LIVE MATCHING TESTER */}
      {activeTab === 'sandbox' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-orange-500/10 text-[#FF6B00] rounded-lg">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Manual Matching Engine Sandbox (Admin Inspection View)
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Inspect how customer questions match against the active FAQ database. Test exact phrasing, typos, alternative questions, and safety fallbacks.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <span className="text-slate-400">Match Threshold:</span>
              <span className="font-mono font-bold text-[#FF6B00]">{Math.round(MIN_CONFIDENCE_THRESHOLD * 100)}%</span>
            </div>
          </div>

          {/* Quick Scenario Chips */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Test Scenarios:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Exact Match', q: 'How can I book a shipment?' },
                { label: 'Alternative Phrasing', q: 'How do I send goods?' },
                { label: 'Alternative 2', q: 'What is the booking procedure?' },
                { label: 'Typo / Spelling Mistake', q: 'How can I traack my shpmnt?' },
                { label: 'Pricing / Quote Request', q: 'What is the cost per kg for road freight?' },
                { label: 'Office & Opening Hours', q: 'Where is your office located and what are your opening hours?' },
                { label: 'Prohibited Goods Policy', q: 'Can you ship 50 boxes of cigarettes?' },
                { label: 'Unknown Query (Fallback)', q: 'What is the weather in Tokyo?' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRunTest(chip.q)}
                  disabled={isTesting}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] hover:border-orange-200 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer text-left"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunTest();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Type customer question to test manual matching engine..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#FF6B00] focus:bg-white font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isTesting || !testQuery.trim()}
              className="px-4 py-2.5 bg-[#0B132B] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test Query</span>
            </button>
          </form>

          {/* Test Results Display */}
          {testResult && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-xs font-bold text-slate-800">
                    Query: <span className="italic text-slate-600 font-normal">"{testResult.query}"</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {!testResult.isFallback && testResult.confidence >= MIN_CONFIDENCE_THRESHOLD ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Matched {Math.round(testResult.confidence * 100)}% ({testResult.matchLayer})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Below Threshold ({Math.round(testResult.confidence * 100)}%) - Fallback Triggered</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">{testResult.timestamp}</span>
                </div>
              </div>

              {/* Matched FAQ Details */}
              {testResult.matchedFaqId && (
                <div className="text-xs text-slate-600 flex items-center space-x-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Target FAQ:</span>
                  <span className="px-2 py-0.5 bg-slate-200 rounded font-mono font-bold text-slate-800">
                    {testResult.matchedFaqId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700">{testResult.matchedQuestion}</span>
                </div>
              )}

              {/* Response Output */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assistant Response:</span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {testResult.answer}
                </div>
              </div>

              {testResult.hasQuoteAction && (
                <div className="flex items-center space-x-2 pt-1 text-xs text-orange-700">
                  <span className="px-2 py-0.5 bg-orange-100 rounded text-[10px] font-bold">
                    Action Displayed: [Request a Quote] button active
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. TAB CONTENT: UNANSWERED QUESTIONS */}
      {activeTab === 'unanswered' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Unanswered Customer Questions</h3>
              <p className="text-xs text-slate-500">
                Visitor questions that scored below the confidence threshold. Convert popular inquiries into approved FAQs with one click.
              </p>
            </div>
            <button
              onClick={loadData}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {unanswered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">All customer questions are covered!</p>
              <p className="text-xs text-slate-400">No unanswered questions have been logged recently.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {unanswered.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">"{item.rawQuestion}"</p>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                      <span>Logged: {new Date(item.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>Score: {Math.round(item.confidenceScore * 100)}%</span>
                      {item.closestFaqId && (
                        <>
                          <span>•</span>
                          <span>Nearest FAQ: {item.closestFaqId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(item.rawQuestion)}
                      className="px-3 py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Convert to FAQ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUnanswered(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. MODAL: ADD / EDIT FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingFaq ? 'Edit FAQ Entry' : 'Create New Approved FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value="Booking & Quotes">Booking &amp; Quotes</option>
                    <option value="Air Freight">Air Freight</option>
                    <option value="Road Transport">Road Transport</option>
                    <option value="Shipment Tracking">Shipment Tracking</option>
                    <option value="Company & Support">Company &amp; Support</option>
                    <option value="Prohibited & Regulated Goods">Prohibited &amp; Regulated Goods</option>
                    <option value="Customs & Permits">Customs &amp; Permits</option>
                    <option value="Policies & Terms">Policies &amp; Terms</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={faqForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value="active">Active (Visible in Chatbot)</option>
                    <option value="inactive">Inactive (Draft / Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. How can I book a shipment?"
                  value={faqForm.mainQuestion}
                  onChange={(e) => setFaqForm({ ...faqForm, mainQuestion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alternative Questions (one per line)
                </label>
                <p className="text-[10px] text-slate-400 mb-1">
                  Different ways customers ask this same question (e.g. "How do I send goods?", "What is the booking procedure?").
                </p>
                <textarea
                  rows={3}
                  placeholder="How do I send goods?&#10;How can I transport products?&#10;What is the booking procedure?"
                  value={faqForm.alternativeQuestions}
                  onChange={(e) => setFaqForm({ ...faqForm, alternativeQuestions: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="book, shipment, send, transport, cargo, freight"
                  value={faqForm.keywords}
                  onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approved Answer <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] text-slate-400 mb-1">
                  Company approved response. Markdown links like [Request a Quote](/quote) or [Contact our team](/contact) are supported.
                </p>
                <textarea
                  rows={4}
                  placeholder="Official company approved response text..."
                  value={faqForm.approvedAnswer}
                  onChange={(e) => setFaqForm({ ...faqForm, approvedAnswer: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="hasQuoteAction"
                  checked={faqForm.hasQuoteAction}
                  onChange={(e) => setFaqForm({ ...faqForm, hasQuoteAction: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF6B00] focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="hasQuoteAction" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Display "Request a Quote" / "Contact our team" button banner under this answer
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  {editingFaq ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
