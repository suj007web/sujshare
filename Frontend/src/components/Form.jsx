import { useState } from 'react';
import { FiUpload, FiDownload, FiArrowRight, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQrCode(response.data.file.qrCode);
      setFileUrl(response.data.file.cloudinaryUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">File Upload & QR Code Generator</h2>
        
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input 
              type="file" 
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-700 file:text-white
                hover:file:bg-gray-600"
              onChange={handleFileChange}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="group flex w-full h-10 items-center justify-center gap-2 rounded-full bg-gray-700 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white"
          >
            <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
              <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
            </span>
            <span className="flex items-center">
              {isUploading ? (
                <>
                  <FiUpload className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Upload File
                </>
              )}
            </span>
          </button>
        </div>

        {qrCode && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-center">Your QR Code</h3>
            <img src={qrCode} alt="QR Code" className="mx-auto" />
            <a
              href={qrCode}
              download="qr-code.png"
              className="group flex w-full h-10 items-center justify-center gap-2 rounded-full bg-gray-700 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white"
            >
              <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
              </span>
              <span className="flex items-center">
                <FiDownload className="mr-2" />
                Download QR Code
              </span>
            </a>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full h-10 items-center justify-center gap-2 rounded-full bg-gray-700 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white"
              >
                <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
                  <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
                </span>
                <span className="flex items-center">
                  <FiExternalLink className="mr-2" />
                  View Uploaded File
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;