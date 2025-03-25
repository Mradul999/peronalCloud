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
import { db, storage } from "../firebase";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { CreateEditFolderModal } from "../components/CreateEditFolderModal";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles, loadingState } = useFolder(
    folderId,
    state?.folder
  );
  const isDataLoading = loadingState?.childFolders && loadingState?.childFiles;
  
  // File deletion states
  const [showConformationModal, setShowConformationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Folder states
  const [showFolderConformationModal, setShowFolderConformationModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);

  // File deletion handlers
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
          showSuccessToast("File deleted successfully");
        })
        .catch((err) => {
          setShowConformationModal(false);
          showErrorToast(err.message);
        });
    });
  };

  // Folder deletion handlers
  const openFolderDeletionModal = (folder) => {
    setSelectedFolder(folder);
    setShowFolderConformationModal(true);
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    
    try {
      // First, check if the folder has any children (files or folders)
      const childFilesQuery = await db.files
        .where("folderId", "==", selectedFolder.id)
        .where("userId", "==", selectedFolder.userId)
        .get();
      
      const childFoldersQuery = await db.folders
        .where("parentId", "==", selectedFolder.id)
        .where("userId", "==", selectedFolder.userId)
        .get();
      
      if (!childFilesQuery.empty || !childFoldersQuery.empty) {
        showErrorToast("Cannot delete folder that contains files or folders");
        setShowFolderConformationModal(false);
        return;
      }
      
      // Delete the folder if it's empty
      await db.folders
        .doc(selectedFolder.id)
        .delete()
        .then(() => {
          setShowFolderConformationModal(false);
          showSuccessToast("Folder deleted successfully");
        })
        .catch((err) => {
          setShowFolderConformationModal(false);
          showErrorToast(err.message);
        });
    } catch (error) {
      console.error("Error deleting folder:", error);
      showErrorToast("Error deleting folder");
      setShowFolderConformationModal(false);
    }
  };

  // Folder rename handlers
  const openFolderRenameModal = (folder) => {
    setSelectedFolder(folder);
    setShowRenameFolderModal(true);
  };

  const handleRenameFolder = async (data) => {
    if (!selectedFolder || !data.name) return;
    
    try {
      await db.folders
        .doc(selectedFolder.id)
        .update({
          name: data.name
        })
        .then(() => {
          showSuccessToast("Folder renamed successfully");
        })
        .catch((err) => {
          showErrorToast(err.message);
        });
    } catch (error) {
      console.error("Error renaming folder:", error);
      showErrorToast("Error renaming folder");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <CreateFolderButton currentFolder={folder} />
            <AddFileButton currentFolder={folder} />
          </div>

          <div className="mb-6">
            <FolderBreadcrumbs currentFolder={folder} />
          </div>
        </div>

        {isDataLoading ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            {childFolders?.length === 0 && childFiles?.length === 0 && (
              <div className="my-12 flex flex-col items-center justify-center space-y-3 text-center">
                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No files or folders</h3>
                <p className="text-sm text-gray-500">Create a folder or upload a file to get started</p>
              </div>
            )}

            {childFolders?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Folders</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {childFolders.map((childFolder) => (
                    <FolderItem 
                      key={childFolder.id} 
                      folder={childFolder} 
                      onDelete={openFolderDeletionModal}
                      onRename={openFolderRenameModal}
                    />
                  ))}
                </div>
              </div>
            )}

            {childFiles?.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-medium text-gray-900">Files</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {childFiles.map((childFile) => (
                    <FileItem
                      key={childFile.id}
                      file={childFile}
                      onDelete={openConformationModal}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <LoadingRing size="large" />
          </div>
        )}
      </main>

      {/* File deletion confirmation modal */}
      <ConfirmationModal
        isOpen={showConformationModal}
        onRequestClose={() => setShowConformationModal(false)}
        title="Delete File"
        message="Are you sure you want to delete this file?"
        confirmButtonText="Delete"
        onConfirm={handleDeleteFile}
      />

      {/* Folder deletion confirmation modal */}
      <ConfirmationModal
        isOpen={showFolderConformationModal}
        onRequestClose={() => setShowFolderConformationModal(false)}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={handleDeleteFolder}
      />

      {/* Folder rename modal */}
      <CreateEditFolderModal
        showModal={showRenameFolderModal}
        setShowModal={setShowRenameFolderModal}
        selectedFolder={selectedFolder}
        handleEdit={handleRenameFolder}
      />
    </div>
  );
}
