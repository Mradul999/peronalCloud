import { FileUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { db, storage } from "../firebase";
import { ALERT_CLASSES } from "../constants";
import { useAlert } from "../contexts/AlertContext";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  const { showAlert } = useAlert();

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
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
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

        showAlert(ALERT_CLASSES.SUCCESS, "Upload completed successfully");
      }
    );
  }

  return (
    <>
      <label className="btn btn-primary flex-grow overflow-hidden">
        <FileUp />
        <span>Upload File</span>
        <input
          type="file"
          onChange={handleUpload}
          className="absolute -left-96 opacity-0"
        />
      </label>
      {uploadingFiles.length > 0 &&
        uploadingFiles.map((file) => (
          <dialog key={file.id} className="modal modal-open">
            <div className="modal-box flex min-w-64 flex-col gap-4">
              {file.name}
              <progress
                className="progress progress-primary"
                value={file.error ? 100 : file.progress * 100}
                max="100"
              />
            </div>
          </dialog>
        ))}
    </>
  );
}
