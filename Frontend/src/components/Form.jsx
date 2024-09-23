import { useState } from 'react';
import { FiUpload, FiDownload, FiExternalLink, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setQrCode(response.data.file.qrCode);
      setFileUrl(response.data.file.cloudinaryUrl);
      setUploadComplete(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          File Upload & QR Code Generator
        </h2>
        
        <div className="space-y-6">
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input 
              type="file" 
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white
                hover:file:bg-gradient-to-r hover:file:from-blue-600 hover:file:to-purple-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onChange={handleFileChange}
            />
          </label>

          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`group relative w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isUploading || !file
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {uploadComplete ? (
                <FiCheck className="h-5 w-5 text-green-500" />
              ) : (
                <FiUpload className="h-5 w-5" />
              )}
            </span>
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>

          {isUploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {qrCode && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Your QR Code
            </h3>
            <img src={qrCode} alt="QR Code" className="mx-auto rounded-lg shadow-lg" />
            <div className="space-y-4">
              <a
                href={qrCode}
                download="qr-code.png"
                className="group relative w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FiDownload className="h-5 w-5" />
                </span>
                Download QR Code
              </a>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiExternalLink className="h-5 w-5" />
                  </span>
                  View Uploaded File
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;