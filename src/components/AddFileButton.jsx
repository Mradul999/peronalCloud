import { FileUp, X, FileCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { db, storage } from "../firebase";
import PropTypes from "prop-types";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();

  function handleUpload(e) {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;

    const id = uuidV4();
    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }

            return uploadFile;
          });
        });
      },
      (error) => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
        showErrorToast("Failed to upload file");
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          db.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then((existingFiles) => {
              const existingFile = existingFiles.docs[0];
              if (existingFile) {
                existingFile.ref.update({ url: url });
              } else {
                db.files.add({
                  url: url,
                  name: file.name,
                  createdAt: db.getCurrentTimestamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                });
              }
            });
        });

        showSuccessToast("Upload completed successfully");
      }
    );
  }

  const handleCancelUpload = (id) => {
    setUploadingFiles((prevUploadingFiles) => {
      return prevUploadingFiles.filter((uploadFile) => uploadFile.id !== id);
    });
  };

  return (
    <>
      <label className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <FileUp className="h-5 w-5" />
        <span>Upload File</span>
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
      
      {uploadingFiles.length > 0 &&
        uploadingFiles.map((file) => (
          <div key={file.id} className="fixed inset-0 z-50 overflow-hidden" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {file.error ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <FileUp className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {file.error ? "Upload Failed" : "Uploading File"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {file.error ? "There was an error uploading your file" : "Please wait while your file uploads"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCancelUpload(file.id)}
                    className="rounded-full bg-gray-100 p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-3 overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
                  </div>
                </div>
                
                <div className="mb-1.5 text-sm font-medium text-gray-700">
                  {file.error ? 'Upload failed' : `Progress: ${Math.round(file.progress * 100)}%`}
                </div>
                
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className={`absolute top-0 h-full ${file.error ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ 
                      width: `${file.error ? 100 : file.progress * 100}%`,
                      transition: 'width 0.3s ease-in-out'
                    }}
                  ></div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancelUpload(file.id)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {file.error ? 'Dismiss' : 'Cancel Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

AddFileButton.propTypes = {
  currentFolder: PropTypes.object,
};
