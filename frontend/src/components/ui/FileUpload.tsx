import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

export function FileUpload({ accept, multiple, onFiles }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    onFiles(arr);
    setPreviews(arr.filter(f => f.type.startsWith('image/')).map(f => URL.createObjectURL(f)));
  }, [onFiles]);

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept || ''; i.multiple = !!multiple; i.onchange = () => handleFiles(i.files); i.click(); }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <p className="text-sm text-gray-600">Drag & drop files here or click to browse</p>
      </div>
      {previews.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {previews.map((src, i) => <img key={i} src={src} alt="preview" className="h-16 w-16 rounded object-cover" />)}
        </div>
      )}
    </div>
  );
}
