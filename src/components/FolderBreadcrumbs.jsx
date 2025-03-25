import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../hooks/useFolder";
import PropTypes from "prop-types";
import { ChevronRight, Home, Folder } from "lucide-react";

export default function FolderBreadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  
  if (currentFolder && currentFolder.path) {
    path = [...path, ...currentFolder.path];
  }
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        {path.map((folder, index) => (
          <li key={folder.id || "root"} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-gray-400" />
            )}
            <Link 
              to={folder.id ? `/folder/${folder.id}` : "/"} 
              state={{ folder: { ...folder } }}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {index === 0 ? (
                <Home className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              ) : (
                <Folder className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              )}
              <span>{folder.name}</span>
            </Link>
          </li>
        ))}
        
        {currentFolder && currentFolder !== ROOT_FOLDER && (
          <li className="flex items-center">
            <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="flex items-center text-sm font-medium text-gray-900">
              <Folder className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              {currentFolder.name}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

FolderBreadcrumbs.propTypes = {
  currentFolder: PropTypes.object,
};
