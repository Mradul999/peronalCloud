import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { CreateEditFolderModal } from "./CreateEditFolderModal";
import { FolderPlus } from "lucide-react";
import { useAlert } from "../contexts/AlertContext";
import { ALERT_CLASSES } from "../constants";
import { db } from "../firebase";

export default function CreateFolderButton({ currentFolder }) {
  const [showCreateEditFolderModal, setShowCreateEditFolderModal] =
    useState(false);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

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

        console.log("Folder is successfully created");
      } catch (e) {
        console.log("Error while creating a folder", e);
        showAlert(ALERT_CLASSES.ERROR, "Error while creating a folder");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button
        disabled={loading}
        className="btn btn-primary flex-grow overflow-hidden"
        onClick={() => openCreateEditFolderModal()}
      >
        {loading ? (
          <span className="loading loading-spinner" />
        ) : (
          <FolderPlus />
        )}
        Create Folder
      </button>

      <CreateEditFolderModal
        showModal={showCreateEditFolderModal}
        setShowModal={setShowCreateEditFolderModal}
        handleCreate={handleCreateFolder}
      />
    </>
  );
}
