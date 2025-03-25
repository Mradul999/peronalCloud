import { X, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export function ConfirmationModal({
  isOpen,
  onRequestClose,
  title,
  message,
  confirmButtonText = "Delete",
  onConfirm,
}) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      modalRef?.current?.showModal();
      document.body.classList.add('overflow-hidden');
    } else {
      modalRef?.current?.close();
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onRequestClose();
    }
  };

  return (
    <dialog 
      ref={modalRef}
      onClick={handleBackdropClick} 
      className="fixed inset-0 z-50 m-0 h-full w-full overflow-hidden bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm transition-all duration-300 ease-in-out"
    >
      <div className="flex h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            disabled={loading}
            className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onRequestClose}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-5 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3 sm:justify-end">
            <button
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
              onClick={onRequestClose}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 sm:w-auto"
              onClick={handleSubmit}
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                confirmButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};
