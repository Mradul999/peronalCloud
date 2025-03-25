import Signup from "./pages/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Test from "./pages/Test";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-screen" data-theme="fantasy">
      <AuthProvider>
        <BrowserRouter>
          {/* Toast container */}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                maxWidth: '500px',
                padding: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
            }}
          />
          
          <Routes>
            {/* Private Routes should be inside Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/folder/:folderId"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/test" element={<Test />} />
            <Route path="/home" element={<Home />} />
            
            {/* Authentication Routes - Redirect logged-in users */}
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
