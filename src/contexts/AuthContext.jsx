import { useContext, useState, useEffect, createContext } from "react";
import { auth } from "../firebase";
import PropTypes from "prop-types";

AuthProvider.propTypes = {
  children: PropTypes.node,
};

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  // Enhanced login function with retry mechanism
  async function login(email, password) {
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.log(`Login attempt ${attempt + 1} failed:`, error.code);
        lastError = error;
        
        // Only retry for network-related errors
        if (!['auth/network-request-failed', 'auth/timeout'].includes(error.code)) {
          throw error; // Don't retry for auth errors like wrong password
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    
    // If we've exhausted all retries
    throw lastError;
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.verifyBeforeUpdateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
