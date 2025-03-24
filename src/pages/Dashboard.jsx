import NavBar from "../components/NavBar";
import FolderBreadcrumbs from "../components/FolderBreadcrumbs";
import FolderItem from "../components/FolderItem";
import CreateFolderButton from "../components/CreateFolderButton";
import { useFolder } from "../hooks/useFolder";
import { useParams, useLocation } from "react-router-dom";
import AddFileButton from "../components/AddFileButton";
import FileItem from "../components/FileItem";
import LoadingRing from "../components/LoadingRing";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { useState } from "react";
import { useAlert } from "../contexts/AlertContext";
import { db, storage } from "../firebase";
import { ALERT_CLASSES } from "../constants";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles, loadingState } = useFolder(
    folderId,
    state.folder
  );
  const isDataLoading = loadingState.childFolders && loadingState.childFiles;
  const { showAlert } = useAlert();
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openConformationModal = (file) => {
    setSelectedFile(file);
    setShowConformationModal(true);
  };

  const handleDeleteFile = async () => {
    const fileRef = storage.refFromURL(selectedFile.url);

    await fileRef.delete().finally(async () => {
      await db.files
        .doc(selectedFile.id)
        .delete()
        .then(() => {
          setShowConformationModal(false);
          showAlert(ALERT_CLASSES.SUCCESS, "File deleted successfully");
        })
        .catch((err) => {
          setShowConformationModal(false);
          showAlert(ALERT_CLASSES.ERROR, err.message);
        });
    });
  };

  return (
    <div className="min-h-full bg-white">
      <NavBar />

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          <CreateFolderButton currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
        </div>

        <div className="my-4">
          <FolderBreadcrumbs currentFolder={folder} />
        </div>

        {isDataLoading ? (
          <div>
            {childFolders.length == 0 && childFiles.length == 0 && (
              <div className="divider">Create a folder or upload a file</div>
            )}

            {childFolders?.length > 0 && <h5 className="mb-4">Folders:</h5>}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {childFolders?.length > 0 &&
                childFolders.map((childFolder) => (
                  <FolderItem key={childFolder.id} folder={childFolder} />
                ))}
            </div>

            {childFolders.length > 0 && childFiles.length > 0 && (
              <div className="divider"></div>
            )}

            {childFiles?.length > 0 && <h5 className="mb-4">Files:</h5>}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {childFiles.length > 0 &&
                childFiles.map((childFile) => (
                  <FileItem
                    key={childFile.id}
                    file={childFile}
                    openConformationModal={openConformationModal}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full  justify-center">
            <LoadingRing />
          </div>
        )}
      </div>

      <ConfirmationModal
        showModal={showConformationModal}
        setShowModal={setShowConformationModal}
        title="Delete File"
        text={`Are you sure you want to delete: ${selectedFile?.name}?`}
        onConfirmation={handleDeleteFile}
      />
    </div>
  );
}
