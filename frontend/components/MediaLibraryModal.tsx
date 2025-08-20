import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: any) => void;
}

export default function MediaLibraryModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    // Placeholder: close immediately in absence of actual library UI
    const timer = setTimeout(onClose, 0);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-600">Media library not implemented.</p>
        <button className="mt-4 px-3 py-1 border rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
