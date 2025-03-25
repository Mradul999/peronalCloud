import { X, FolderPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export function CreateEditFolderModal({
  showModal,
  setShowModal,
  selectedFolder,
  handleEdit,
  handleCreate,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const modalRef = useRef(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (showModal) {
      modalRef?.current?.showModal();
      document.body.classList.add('overflow-hidden');
    } else {
      reset();
      modalRef?.current?.close();
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal, reset]);

  useEffect(() => {
    if (selectedFolder?.name) {
      setValue("name", selectedFolder.name);
    }
  }, [selectedFolder, setValue]);

  const handleBackdropClick = (e) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setShowModal(false);
    }
  };

  return (
    <dialog 
      ref={modalRef} 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 h-full w-full overflow-hidden bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm transition-all duration-300 ease-in-out"
      style={{ maxHeight: '100vh' }}
    >
      <div className="flex h-full items-center justify-center p-0">
        <div 
          className="relative mx-auto w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute -left-1 -top-1 h-20 w-20 rounded-tl-xl bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
          
          <form
            method="dialog"
            onSubmit={handleSubmit((data) => {
              setShowModal(false);
              return selectedFolder ? handleEdit(data, selectedFolder) : handleCreate(data);
            })}
            className="relative z-10 space-y-6"
          >
            <button
              type="button"
              className="absolute right-0 top-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 shadow-sm">
                <FolderPlus className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedFolder ? "Edit" : "Create"} Folder
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedFolder 
                    ? "Update your folder name below" 
                    : "Enter a name for your new folder"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Folder Name
              </label>
              <div className="relative">
                <input
                  {...register("name", { 
                    required: "Folder name is required",
                    minLength: { value: 1, message: "Name cannot be empty" }
                  })}
                  autoFocus
                  type="text"
                  placeholder="Enter folder name"
                  className={`block w-full rounded-lg border px-4 py-3 pl-10 text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    showErrors && errors.name 
                      ? "border-red-300 bg-red-50" 
                      : "border-gray-300 bg-white"
                  }`}
                />
                <FolderPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {showErrors && errors.name && (
                <p className="flex items-center text-sm text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => setShowErrors(true)}
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  selectedFolder ? "Update" : "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
