import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  CheckCircle,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Camera,
  RefreshCw,
  Layers
} from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated?: () => void;
}

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  currentPreview: string;
  file?: File;
  previewUrl?: string;
}

const DEFAULT_SLOTS: PhotoSlot[] = [
  {
    id: 'team',
    label: '1. Master Barber Crew (All Barbers)',
    description: 'Group photo of all barbers together in the shop.',
    currentPreview: '/team.jpg'
  },
  {
    id: 'shop',
    label: '2. Main Barbershop Interior & Stations',
    description: 'Shop interior with styling chairs, mirrors, and active barbers.',
    currentPreview: '/shop.jpg'
  },
  {
    id: 'cut',
    label: '3. Barber Cutting / Shaving Customer',
    description: 'Close-up of barber using clippers or razor on customer.',
    currentPreview: '/cut.jpg'
  },
  {
    id: 'barber-banner',
    label: '4. Banner Mwangi (Lead Master Barber)',
    description: 'Portrait photo of Banner Mwangi at workstation.',
    currentPreview: '/barber-banner.jpg'
  },
  {
    id: 'barber-kelvin',
    label: '5. Kelvin Mutua (Senior Fade Artisan)',
    description: 'Portrait photo of Kelvin Mutua at styling station.',
    currentPreview: '/barber-kelvin.jpg'
  },
  {
    id: 'barber-brian',
    label: '6. Brian Musyoka (Master Shaver)',
    description: 'Photo of Brian Musyoka shaving or trimming client.',
    currentPreview: '/barber-brian.jpg'
  },
  {
    id: 'barber-dennis',
    label: '7. Dennis Kimanzi (Facial & Beard Care)',
    description: 'Photo of Dennis Kimanzi detailing or grooming client.',
    currentPreview: '/barber-dennis.jpg'
  },
  {
    id: 'station',
    label: '8. Barber Station, Chair & Tools',
    description: 'Styling chair, rotating barber pole, ring light or tools.',
    currentPreview: '/station.jpg'
  }
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated
}) => {
  const [slots, setSlots] = useState<PhotoSlot[]>(DEFAULT_SLOTS);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Single file selection for a specific slot
  const handleSingleSlotSelect = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, file, previewUrl: dataUrl } : s
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Batch multi-file selection (up to 10 WhatsApp photos at once)
  const handleBatchSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorStatus(null);
    setUploadStatus(`Selected ${files.length} photos. Processing previews...`);

    const updated = [...slots];
    let processed = 0;

    files.slice(0, slots.length).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            file,
            previewUrl: dataUrl
          };
        }
        processed += 1;
        if (processed === Math.min(files.length, slots.length)) {
          setSlots([...updated]);
          setUploadStatus(`Assigned ${processed} photos to slots. Click "Save & Replace All Photos" to publish!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Save all selected photos to the server
  const handleSaveAll = async () => {
    const photosToUpload = slots.filter((s) => s.previewUrl);
    if (photosToUpload.length === 0) {
      setErrorStatus('Please select at least one real photo to upload.');
      return;
    }

    setIsUploading(true);
    setErrorStatus(null);
    setUploadStatus('Uploading real photos to server...');

    try {
      const payload = {
        photos: photosToUpload.map((s) => ({
          slot: s.id,
          dataUrl: s.previewUrl
        }))
      };

      const res = await fetch('/api/upload-batch-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadStatus('All real photos successfully uploaded and published!');
        if (onPhotosUpdated) {
          onPhotosUpdated();
        }
        // Cache bust images on the page
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setErrorStatus(data.error || 'Failed to save photos to server.');
      }
    } catch {
      setErrorStatus('Network error while saving photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0E0E12] border border-[#2A2A38] rounded-2xl shadow-2xl text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-[#121217]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFB76C]/10 border border-[#DFB76C]/30 flex items-center justify-center text-[#DFB76C]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Upload Your Real Barbershop Photos
              </h2>
              <p className="text-xs text-zinc-400">
                Replace all website images with your exact WhatsApp photos. No AI pictures.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Banner / Quick Multi-Upload */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#DFB76C]/15 via-black/40 to-[#DFB76C]/5 border-b border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#DFB76C] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 1-Click Multi-Upload</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300">
                Select your 10 WhatsApp photos from your phone or computer. The system automatically assigns them to the Crew, Barbers, and Stations.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <input
                ref={batchInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => batchInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Select All 10 Photos</span>
              </button>
            </div>
          </div>

          {uploadStatus && (
            <div className="mt-3 p-3 rounded-xl bg-[#DFB76C]/10 border border-[#DFB76C]/40 text-[#DFB76C] text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {errorStatus && (
            <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}
        </div>

        {/* Slots Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-xs font-medium text-zinc-400">
            Preview and customize each photo assignment below:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => {
              const displayImage = slot.previewUrl || slot.currentPreview;
              return (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-xl bg-[#141419] border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3.5"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                    <img
                      src={displayImage}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {slot.previewUrl && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {slot.label}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mb-2">
                      {slot.description}
                    </p>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-[11px] text-zinc-200 font-medium cursor-pointer transition-colors border border-zinc-700">
                      <Upload className="w-3 h-3 text-[#DFB76C]" />
                      <span>{slot.previewUrl ? 'Change Photo' : 'Choose Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSingleSlotSelect(slot.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-zinc-800 bg-[#121217] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span>Uploaded photos will immediately replace the active pictures on the live site.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isUploading || !slots.some((s) => s.previewUrl)}
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C5A059]/20"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving & Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Save & Replace All Photos</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
