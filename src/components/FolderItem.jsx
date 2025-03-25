import { FolderIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

export default function FolderItem({ folder, onDelete, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md">
      <Link
        to={`/folder/${folder.id}`}
        state={{ folder: folder }}
        className="flex min-w-0 flex-1 items-center"
      >
        <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
          <FolderIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{folder.name}</p>
        </div>
      </Link>
      
      <div className="relative ml-2">
        <button 
          onClick={handleMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                onRename(folder);
                setMenuOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="mr-3 h-4 w-4 text-gray-500" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(folder);
                setMenuOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 className="mr-3 h-4 w-4 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

FolderItem.propTypes = {
  folder: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
};
