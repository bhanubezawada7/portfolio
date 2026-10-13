import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Copy, Check, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import type { MediaAsset } from '../../types';

interface MediaUploaderProps {
  onUploadSuccess?: (asset: MediaAsset) => void;
  allowedTypes?: 'images' | 'all';
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadSuccess,
  allowedTypes = 'all'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedAsset, setUploadedAsset] = useState<MediaAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (allowedTypes === 'images' && !selected.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    setFile(selected);
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const asset = await uploadToCloudinary(file, (p) => setProgress(p));
      setUploadedAsset(asset);
      if (onUploadSuccess) onUploadSuccess(asset);
    } catch (err: any) {
      setError(err?.message || 'Media upload failed. Please verify Cloudinary preset settings.');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = () => {
    if (!uploadedAsset?.secureUrl) return;
    navigator.clipboard.writeText(uploadedAsset.secureUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setUploadedAsset(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          Cloudinary Media Upload
        </h4>
        <span className="text-xs text-slate-500">Preset: portfolio</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drop zone / Input */}
      {!uploadedAsset ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-900/50 hover:bg-slate-900"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes === 'images' ? 'image/*' : 'image/*,video/*,application/pdf'}
              onChange={handleFileSelect}
              className="hidden"
            />
            {preview ? (
              <div className="space-y-3">
                <img
                  src={preview}
                  alt="Upload preview"
                  className="max-h-40 mx-auto rounded-lg object-contain border border-slate-800"
                />
                <p className="text-xs text-slate-400">Click to choose a different file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs sm:text-sm font-medium text-slate-300">
                  Click to browse or drag and drop image or video
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports JPG, PNG, WEBP, MP4 (Up to 20MB)
                </p>
              </div>
            )}
          </div>

          {file && (
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-400 truncate">
                Selected: <span className="text-slate-200 font-medium">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading {progress}%...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload to Cloudinary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        /* Uploaded Success State */
        <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Upload Complete!
            </span>
            <button
              onClick={reset}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Upload another
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={uploadedAsset.secureUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono select-all"
            />
            <button
              onClick={copyUrl}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
