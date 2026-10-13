import React, { useState } from 'react';
import { Mail, Trash2, Reply, Search } from 'lucide-react';
import { updateInquiryStatus, deleteInquiry } from '../../repositories/inquiryRepo';
import type { Inquiry } from '../../types';

interface InquiryManagerProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export const InquiryManager: React.FC<InquiryManagerProps> = ({ inquiries, onRefresh }) => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'resolved'>('all');
  const [search, setSearch] = useState('');

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = filter === 'all' || inq.status === filter;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      inq.subject.toLowerCase().includes(query) ||
      inq.message.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: 'unread' | 'read' | 'resolved') => {
    try {
      await updateInquiryStatus(id, newStatus);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => (prev ? { ...prev, status: newStatus } : null));
      }
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiry(id);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete inquiry: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            Contact Inquiries & Messages
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Incoming communication from recruiters, collaborators, and clients.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inquiries List */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[550px] overflow-y-auto">
            {filteredInquiries.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500 italic">No inquiries found.</p>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    if (inq.status === 'unread') {
                      handleStatusChange(inq.id, 'read');
                    }
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-indigo-950/30 border-l-2 border-indigo-500'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">{inq.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        inq.status === 'unread'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : inq.status === 'resolved'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-300/90 font-medium truncate">{inq.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{inq.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Inquiry Detail */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800">
          {selectedInquiry ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{selectedInquiry.subject}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    From:{' '}
                    <span className="text-slate-200 font-semibold">{selectedInquiry.name}</span>{' '}
                    &lt;{selectedInquiry.email}&gt;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                      selectedInquiry.subject
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedInquiry.message}
              </div>

              {/* Status Update Options */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Update Inquiry Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'unread')}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                      selectedInquiry.status === 'unread'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mark Unread
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'resolved')}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                      selectedInquiry.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 space-y-2">
              <Mail className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">Select an inquiry to view the full message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
