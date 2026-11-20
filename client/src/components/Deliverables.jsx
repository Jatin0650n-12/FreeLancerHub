import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeliverablesForProject, uploadDeliverable } from '../services/api';
import { toast } from 'react-toastify';
import {
  FileText,
  UploadCloud,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
  Sparkles,
  X,
  File,
} from 'lucide-react';

let backendUrl = import.meta.env.VITE_API_BASE_URL;
if (!backendUrl || (import.meta.env.PROD && backendUrl.includes("localhost"))) {
  backendUrl = "https://freelancerhub-backend-edjd.onrender.com";
}

const Deliverables = ({ project }) => {
  const [deliverables, setDeliverables] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewModalUrl, setPreviewModalUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchDeliverables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDeliverablesForProject(project._id);
      setDeliverables(data || []);
    } catch (error) {
      toast.error('Could not fetch deliverables.');
    } finally {
      setLoading(false);
    }
  }, [project._id]);

  useEffect(() => {
    fetchDeliverables();
  }, [fetchDeliverables]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Please select a file to upload.');
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('deliverable', file);
    formData.append('description', description);

    try {
      await uploadDeliverable(project._id, formData);
      toast.success('Deliverable uploaded successfully!');
      setFile(null);
      setDescription('');
      if (document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }
      fetchDeliverables();
    } catch (error) {
      toast.error(error.message || 'File upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const freelancerId = project.freelancer?._id || project.freelancer;
  const isFreelancer = user?.role === 'freelancer' && user?._id === freelancerId;

  return (
    <div className="space-y-6">
      {/* Upload Box for Freelancer */}
      {isFreelancer && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Project Deliverable</h3>
              <p className="text-xs text-slate-500">
                Upload work assets (source code archives, designs, documentation) for client review.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Deliverable Notes (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what has been completed, test links, or credentials..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                rows="2"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !file}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {submitting ? 'Uploading...' : 'Submit Deliverable'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deliverables List Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Submitted Deliverables</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {deliverables.length} files
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-18 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : deliverables.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <FileText size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No deliverables uploaded yet</p>
            <p className="text-slate-400 mt-0.5">
              Files submitted by the assigned freelancer will appear here for review and download.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliverables.map((item) => {
              const fileName = item.fileUrl ? item.fileUrl.split(/[/\\]/).pop() : 'Deliverable File';
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-2xl gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <File size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 break-all">{fileName}</p>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Uploaded by {item.submittedBy?.name || 'Freelancer'}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isImage && (
                      <button
                        onClick={() => setPreviewModalUrl(item.fileUrl)}
                        className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Preview"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    )}
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <img
              src={previewModalUrl}
              alt="Deliverable Preview"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliverables;
