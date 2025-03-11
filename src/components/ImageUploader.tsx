import React, { useState, useRef } from 'react';
import { ImagePlus, X, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  onClose: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        onImageSelect(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      setIsUploading(true);
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(imageUrl);
        onImageSelect(imageUrl);
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        alert('Invalid image URL');
      };
      img.src = imageUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upload Image</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {!previewUrl ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            {isUploading ? (
              <div className="animate-pulse">
                <div className="w-12 h-12 mx-auto rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ImagePlus className="w-12 h-12 mx-auto text-gray-400" />
                <div className="space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors w-full"
                  >
                    Choose Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="flex items-center justify-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="px-4 text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  </div>

                  <form onSubmit={handleUrlSubmit} className="space-y-2">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-3 border dark:border-gray-600">
                      <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL here"
                        className="w-full py-2 bg-transparent focus:outline-none text-sm dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors w-full disabled:opacity-50"
                      disabled={!imageUrl.trim()}
                    >
                      Upload from URL
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => {
                setPreviewUrl('');
                setImageUrl('');
              }}
              className="absolute top-2 right-2 p-1 bg-gray-800/50 hover:bg-gray-800/75 rounded-full text-white"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                // Removed duplicate class: w-5
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
