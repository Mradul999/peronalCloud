import { FileIcon, MoreVertical, ExternalLink, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function FileItem({ file, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md">
      <div className="flex min-w-0 flex-1 items-center">
        <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100">
          <FileIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
        </div>
      </div>
      
      <div className="relative ml-2">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <a 
              href={file.url} 
              rel="noreferrer" 
              target="_blank"
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ExternalLink className="mr-3 h-4 w-4 text-gray-500" />
              View
            </a>
            <button
              onClick={() => {
                onDelete(file);
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

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
