import { Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";

export default function Breadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];

  return (
    <div className="breadcrumbs">
      <ul className="flex flex-wrap gap-y-1">
        {path.map((folder, index) => (
          <li key={folder.id}>
            <Link
              to={{
                pathname: folder.id ? `/folder/${folder.id}` : "/",
                state: { folder: { ...folder, path: path.slice(1, index) } },
              }}
            >
              <div className="inline-flex max-w-40 items-center gap-1 truncate">
                <Folder size={18} />
                {folder.name}
              </div>
            </Link>
          </li>
        ))}
        {currentFolder && (
          <li>
            <div className="inline-flex max-w-40 items-center gap-1 truncate">
              <Folder size={18} />
              {currentFolder.name}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
