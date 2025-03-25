import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { CreateEditFolderModal } from "./CreateEditFolderModal";
import { FolderPlus } from "lucide-react";
import { db } from "../firebase";
import PropTypes from "prop-types";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export default function CreateFolderButton({ currentFolder }) {
  const [showCreateEditFolderModal, setShowCreateEditFolderModal] =
    useState(false);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const openCreateEditFolderModal = () => {
    setShowCreateEditFolderModal(true);
  };

  const handleCreateFolder = async (data) => {
    const name = data?.name;
    if (name && name !== "") {
      setLoading(true);
      try {
        if (currentFolder == null) return;

        const path = [...currentFolder.path];
        if (currentFolder !== ROOT_FOLDER) {
          path.push({ name: currentFolder.name, id: currentFolder.id });
        }

        await db.folders.add({
          name: name,
          parentId: currentFolder.id,
          userId: currentUser.uid,
          path: path,
          createdAt: db.getCurrentTimestamp(),
        });

        showSuccessToast("Folder created successfully");
      } catch (e) {
        console.log("Error while creating a folder", e);
        showErrorToast("Error while creating a folder");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button
        disabled={loading}
        className="flex w-full items-center justify-center space-x-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        onClick={() => openCreateEditFolderModal()}
      >
        {loading ? (
          <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <FolderPlus className="h-5 w-5" />
        )}
        <span>Create Folder</span>
      </button>

      <CreateEditFolderModal
        showModal={showCreateEditFolderModal}
        setShowModal={setShowCreateEditFolderModal}
        handleCreate={handleCreateFolder}
      />
    </>
  );
}

CreateFolderButton.propTypes = {
  currentFolder: PropTypes.object,
};
