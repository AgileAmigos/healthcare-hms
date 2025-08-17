import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { Upload, FileText, Paperclip, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// --- Type Definitions ---
interface Patient {
  patient_id: number;
  full_name: string;
}

interface Document {
  document_id: number;
  document_name: string;
  document_type: string;
  uploaded_at: string;
}

const PatientDocuments = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the upload form
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    if (!patientId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [patientResponse, documentsResponse] = await Promise.all([
        apiClient.get(`/patients/${patientId}`),
        apiClient.get(`/documents/patient/${patientId}`),
      ]);
      setPatient(patientResponse.data);
      setDocuments(documentsResponse.data);
    } catch (err) {
      setError('Failed to fetch patient data. The patient may not exist.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !documentType || !patientId) {
      setUploadError('Please select a file and specify a document type.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('document_type', documentType);
    formData.append('file', selectedFile);

    try {
      await apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess('File uploaded successfully!');
      setSelectedFile(null);
      setDocumentType('');
      // Refresh the document list
      fetchData();
    } catch (err) {
      setUploadError('File upload failed. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading patient documents...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Document List */}
      <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Patient Documents</h1>
        <p className="text-gray-600 mt-1">
          Viewing documents for: <span className="font-semibold">{patient?.full_name}</span> (ID: {patient?.patient_id})
        </p>

        <div className="mt-6 space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.document_id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold">{doc.document_name}</p>
                    <p className="text-sm text-gray-500">
                      Type: {doc.document_type} | Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* In a real app, you'd have a download button here */}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No documents found for this patient.</p>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-8 rounded-xl shadow-md h-fit">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Upload size={24}/> Upload New Document</h2>
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <div>
            <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700">Document Type</label>
            <input
              id="doc-type"
              type="text"
              required
              placeholder="e.g., Blood Test, X-Ray"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">File</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Select a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">{selectedFile ? selectedFile.name : 'PNG, JPG, PDF up to 10MB'}</p>
              </div>
            </div>
          </div>
          
          {uploadSuccess && <div className="flex items-center text-sm text-green-700"><CheckCircle size={16} className="mr-2"/>{uploadSuccess}</div>}
          {uploadError && <div className="flex items-center text-sm text-red-700"><AlertTriangle size={16} className="mr-2"/>{uploadError}</div>}
          
          <button
            type="submit"
            disabled={isUploading || !selectedFile || !documentType}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUploading ? <><Loader2 className="animate-spin" size={16}/> Uploading...</> : <><Upload size={16}/> Upload File</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientDocuments;

