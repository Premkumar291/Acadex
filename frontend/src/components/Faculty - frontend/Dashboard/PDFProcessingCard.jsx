import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, Download, TrendingUp } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function PDFProcessingCard() {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [loadingSemesterList, setLoadingSemesterList] = useState(false);
  const [semesterPDFs, setSemesterPDFs] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [dragActive, setDragActive] = useState(false);
  // Fixed auto-delete hours to 1
  // Fixed confidence threshold value of 0.8
  const [viewingPdfId, setViewingPdfId] = useState(null);
  const [downloadingPdfId, setDownloadingPdfId] = useState(null);

  // Load existing PDFs when component mounts
  useEffect(() => {
    const fetchExistingPDFs = async () => {
      try {
        setLoadingSemesterList(true);
        // Fetch the most recent PDFs
        const response = await axios.get(`${API_URL}/pdf/recent`);
        if (response.data && response.data.pdfs && response.data.pdfs.length > 0) {
          setSemesterPDFs(response.data.pdfs);
          setUploadId(response.data.uploadName);
          toast.success(`Loaded ${response.data.pdfs.length} existing semester PDFs`);
        }
      } catch {
        // Don't show error toast as this is a background operation
      } finally {
        setLoadingSemesterList(false);
      }
    };

    fetchExistingPDFs();
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setSemesterPDFs([]);
    setSelectedSemester("");
    setUploadId("");
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      // Always use fixed auto-delete hours of 1
      formData.append("autoDeleteHours", "1");
      // Always use fixed confidence threshold of 0.8
      formData.append("confidenceThreshold", "0.8");
      
      // Delete old PDFs before uploading new one
      if (uploadId) {
        try {
          await axios.delete(`${API_URL}/pdf/${uploadId}`);
        } catch {
          // Ignore deletion errors - proceed with upload
        }
      }
      
      // Use the new GridFS-based API endpoint
      const res = await axios.post(`${API_URL}/pdf/split`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("PDF uploaded and split successfully!");
      setUploadId(res.data.uploadName);
      
      // Fetch semester PDFs using the new API
      setLoadingSemesterList(true);
      const listRes = await axios.get(`${API_URL}/pdf/${res.data.uploadName}`);
      setSemesterPDFs(listRes.data);
      
      // Show auto-delete information
      if (res.data.autoDeleteScheduled && res.data.deleteAt) {
        const deleteDate = new Date(res.data.deleteAt);
        toast.success(`PDFs will be auto-deleted at ${deleteDate.toLocaleString()}`);
      }
      
      // Show number of semester PDFs created
      if (listRes.data && listRes.data.length > 0) {
        toast.success(`Created ${listRes.data.length} semester PDF${listRes.data.length !== 1 ? 's' : ''}`);
      }
      setLoadingSemesterList(false);
    } catch (error) {
      // Display the specific error message from the backend if available
      const errorMessage = error.response?.data?.message || "Failed to upload or split PDF";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };



  const handleDownload = async (pdfId) => {
    try {
      // If specific PDF ID is provided, use it
      if (pdfId) {
        setDownloadingPdfId(pdfId);
        window.open(`${API_URL}/pdf/view/${pdfId}?download=true`, '_blank');
        // Reset downloading state after a short delay
        setTimeout(() => setDownloadingPdfId(null), 500);
      } 
      // Otherwise use the selected semester from dropdown
      else if (selectedSemester) {
        const selectedPdf = semesterPDFs.find(pdf => pdf.semester === parseInt(selectedSemester));
        
        if (selectedPdf && selectedPdf.id) {
          // Use the ID-based endpoint
          window.open(`${API_URL}/pdf/view/${selectedPdf.id}?download=true`, '_blank');
        } else {
          // Fallback to the uploadId/semester endpoint
          window.open(`${API_URL}/pdf/${uploadId}/${selectedSemester}?download=true`, '_blank');
        }
      }
    } catch {
      toast.error("Failed to download PDF");
      setDownloadingPdfId(null);
    }
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">

      <h3 className="text-lg font-semibold text-white mb-2">Department Result PDF Splitter</h3>
      <p className="text-gray-300 mb-4">Upload a department result PDF and split it into 8 semester files.</p>
      
      {/* Files will be automatically deleted after 1 hour */}
      <div className="mb-4 text-xs text-gray-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Files will be automatically deleted after 1 hour ({new Date(Date.now() + 60 * 60 * 1000).toLocaleString()})</span>
      </div>
      

      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-2 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 transform hover:scale-[1.02] ${
          dragActive ? 'border-purple-500 bg-gray-900' : 'border-gray-600 bg-gray-900'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-purple-400'}`}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
        onClick={() => !uploading && fileInputRef.current.click()}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <div className="flex flex-col items-center">
          {uploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-3"></div>
          ) : (
            <svg
              className={`w-12 h-12 mb-3 ${dragActive ? 'text-purple-400' : 'text-gray-300'} transform transition-transform duration-300 hover:scale-110`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
          )}
          <p className="mb-2 text-sm text-white">
            {uploading ? (
              <span className="font-semibold animate-pulse">Uploading and processing PDF...</span>
            ) : (
              <>
                <span className="font-semibold">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mb-2">
            {uploading ? (
              <span>This may take a moment depending on file size</span>
            ) : (
              <span>PDF only (MAX. 50MB)</span>
            )}
          </p>
          {!uploading && (
            <div className="mt-2 bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-xs inline-flex items-center transform transition-all duration-300 hover:scale-105 hover:bg-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>PDF will be split by semester markers</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-md font-semibold text-gray-800">Semester PDFs</h4>
          {semesterPDFs.length > 0 && !loadingSemesterList && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {semesterPDFs.length} PDF{semesterPDFs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {loadingSemesterList ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Loading semester PDFs...</p>
            </div>
          </div>
        ) : semesterPDFs.length > 0 ? (
          /* List of semester PDFs with View icon */
          <div className="mt-2 rounded-lg overflow-hidden shadow-lg bg-gray-900 border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Semester</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Filename</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900">
                {semesterPDFs.map((pdf) => (
                  <tr key={pdf.id} className="hover:bg-gray-800 border-b border-gray-800 transition-colors duration-200">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-white">Semester {pdf.semester}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {pdf.filename}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <a 
                        href={`${API_URL}/pdf/view/${pdf.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1.5 ${viewingPdfId === pdf.id ? 'bg-purple-700' : 'bg-purple-900'} text-white rounded-md hover:bg-purple-800 mr-2 shadow-sm transition-all duration-200 transform hover:scale-105 ${viewingPdfId === pdf.id ? 'cursor-wait' : ''}`}
                        title="View PDF"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Set loading state
                          setViewingPdfId(pdf.id);
                          
                          // If the file fails to load, show a toast
                          const img = new Image();
                          img.onerror = () => {
                            toast.error("Unable to load the PDF file.");
                            setViewingPdfId(null);
                          };
                          img.onload = () => {
                            // Reset loading state after a short delay
                            setTimeout(() => setViewingPdfId(null), 500);
                          };
                          img.src = `${API_URL}/pdf/view/${pdf.id}`;
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        <span>{viewingPdfId === pdf.id ? 'Opening...' : 'View'}</span>
                      </a>
                      <button
                        onClick={() => handleDownload(pdf.id, pdf.semester)}
                        className={`inline-flex items-center px-3 py-1.5 ${downloadingPdfId === pdf.id ? 'bg-gray-700' : 'bg-gray-800'} text-white rounded-md hover:bg-gray-700 mr-2 shadow-sm transition-all duration-200 transform hover:scale-105 ${downloadingPdfId === pdf.id ? 'cursor-wait' : ''}`}
                        title="Download PDF"
                        disabled={downloadingPdfId === pdf.id}
                      >
                        <Download size={16} className="mr-1" />
                        <span>{downloadingPdfId === pdf.id ? 'Downloading...' : 'Download'}</span>
                      </button>
                      <div className="relative inline-block">
                        <a 
                          href={`/result-analysis?id=${pdf.id}&semester=${pdf.semester}`}
                          className="inline-flex items-center px-3 py-1.5 bg-purple-900 text-white rounded-md hover:bg-purple-800 shadow-sm transition-all duration-200 transform hover:scale-105"
                          title="Analyze this semester's results"
                        >
                          <TrendingUp size={16} className="mr-1" />
                          <span>Analyze</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-800">
            <p className="text-gray-400">No semester PDFs available. Upload a PDF to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
