import { FileIcon, MoreVertical } from "lucide-react";

export default function FileItem({ file, openConformationModal }) {
  return (
    <div className="card flex flex-grow flex-row items-center justify-between bg-base-100 p-2 shadow-md">
      <div className="ml-2 flex items-center gap-2 truncate">
        <FileIcon className="min-w-fit" />
        <span className="truncate text-ellipsis">{file.name}</span>
      </div>
      <div className="dropdown dropdown-left min-w-fit ">
        <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
          <MoreVertical className="min-w-fit" />
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <a href={file.url} rel="noreferrer" target="_blank">
              View
            </a>
          </li>
          <li>
            <span onClick={() => openConformationModal(file)}>Delete</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
