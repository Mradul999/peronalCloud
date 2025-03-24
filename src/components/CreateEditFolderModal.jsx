import { X } from "lucide-react";
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
    formState: { errors },
  } = useForm();
  const modalRef = useRef(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (showModal) {
      modalRef?.current?.showModal();
    } else {
      reset();
      modalRef?.current?.close();
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedFolder?.name) {
      setValue("name", selectedFolder.name);
    }
  }, [selectedFolder]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <form
          method="dialog"
          onSubmit={handleSubmit((data) => {
            setShowModal(false);

            return selectedFolder
              ? handleEdit(data, selectedFolder)
              : handleCreate(data);
          })}
        >
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-ghost absolute right-2 top-2 text-slate-500 hover:text-slate-600"
            onClick={() => setShowModal(false)}
          >
            <X />
          </button>

          <h3 className="text-lg font-bold">
            {selectedFolder ? "Edit" : "Create"} Folder
          </h3>

          <div>
            <label className="label">
              <span className="label-text text-base">Name</span>
            </label>
            <input
              {...register("name", { required: "Name is required." })}
              type="text"
              placeholder="Enter Name"
              className={
                "input input-bordered w-full" +
                (showErrors && errors.name ? " input-error" : "")
              }
            />
            {showErrors && errors.name && (
              <p className="text-error">{errors.name.message}</p>
            )}
          </div>

          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            onClick={() => setShowErrors(true)}
          >
            {selectedFolder ? "Edit" : "Create"}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowModal(false)}>close</button>
      </form>
    </dialog>
  );
}
