import { User, LogOut, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
      showSuccessToast("Successfully logged out.");
    } catch {
      showErrorToast("Failed to log out.");
    }
  }

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Cloud className="h-6 w-6 text-indigo-600" />
            <span className="px-2 text-xl font-semibold text-gray-900">PersonalCloud</span>
          </div>
          <div className="flex items-center">
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <User className="h-8 w-8 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200" />
                </button>
              </div>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {currentUser && (
                    <div className="block border-b border-gray-200 px-4 py-2 text-sm text-gray-500">
                      <div className="truncate">{currentUser.email}</div>
                    </div>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
