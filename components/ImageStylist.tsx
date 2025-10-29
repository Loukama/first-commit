import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import { UploadIcon, WandIcon, DownloadIcon } from './icons';
import Spinner from './Spinner';

const ImageStylist: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedPrompts = [
    'Add a retro filter',
    'Make the background a beach scene',
    'Give me a futuristic outfit',
    'Change my shirt to a leather jacket',
    'Add a vintage film effect',
    'Make it black and white',
  ];

  const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setEditedImage(null);
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setOriginalImage(base64);
        setOriginalMimeType(mimeType);
      } catch (err) {
        setError('Failed to read image file.');
        console.error(err);
      }
    }
  }, []);

  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${editedImage}`;
      link.download = 'ai-styled-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const resultBase64 = await editImage(originalImage, originalMimeType, prompt);
      setEditedImage(resultBase64);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const ImagePlaceholder: React.FC<{ onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; children?: React.ReactNode }> = ({ onUpload, children }) => (
    <div className="relative w-full aspect-square bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex flex-col justify-center items-center text-gray-400">
        {children || <>
            <UploadIcon className="h-12 w-12 mb-2" />
            <p className="text-center text-sm">Upload your photo to begin</p>
        </>}
        <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={onUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
  );


  return (
    <div className="max-w-5xl mx-auto bg-gray-800/50 rounded-xl shadow-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Upload & Original Image */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-300">Original Photo</h2>
          {originalImage ? (
            <div className="relative">
                <img src={`data:${originalMimeType};base64,${originalImage}`} alt="Original" className="w-full aspect-square object-cover rounded-lg" />
                 <label className="absolute bottom-2 right-2 bg-gray-900/70 hover:bg-pink-600/80 text-white text-xs font-bold py-1 px-2 rounded-md cursor-pointer transition-colors">
                    Change Image
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>
            </div>
          ) : (
            <ImagePlaceholder onUpload={handleImageUpload} />
          )}
        </div>

        {/* Right Side: Prompt & Edited Image */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-300">AI Styled Photo</h2>
          <div className="relative w-full aspect-square bg-gray-800 rounded-lg flex justify-center items-center">
            {isLoading && <Spinner />}
            {!isLoading && editedImage && (
              <>
                <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className="w-full aspect-square object-cover rounded-lg" />
                <button
                    onClick={handleDownload}
                    className="absolute bottom-2 right-2 bg-gray-900/70 hover:bg-pink-600/80 text-white text-xs font-bold py-1 px-2 rounded-md cursor-pointer transition-colors flex items-center gap-1"
                >
                    <DownloadIcon className="h-4 w-4" />
                    <span>Download</span>
                </button>
              </>
            )}
             {!isLoading && !editedImage && !originalImage &&
                <div className="text-gray-500 text-center text-sm p-4">Your styled image will appear here</div>
             }
             {!isLoading && !editedImage && originalImage &&
                <div className="text-gray-400 text-center p-4">
                    <WandIcon className="h-12 w-12 mx-auto mb-2 text-pink-500/50" />
                    <p>Describe the style you want to see!</p>
                </div>
             }
          </div>
        </div>
      </div>

      {/* Bottom: Form */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Make the background a beach scene', 'Give me a futuristic outfit', or 'Add a vintage film effect'"
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-full py-3 pl-5 pr-28 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            disabled={!originalImage || isLoading}
          />
          <button
            type="submit"
            disabled={!originalImage || isLoading || !prompt}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-pink-600 text-white font-semibold py-2 px-5 rounded-full flex items-center gap-2 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <WandIcon className="h-5 w-5" />
            <span>Generate</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              disabled={isLoading || !originalImage}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs font-medium py-1.5 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {p}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default ImageStylist;
