import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

/**
 * A route component that redirects authenticated users away from public routes
 * like login and signup pages to the dashboard page.
 */
export default function PublicRoute({ children }) {
  const { currentUser } = useAuth();

  // If the user is logged in, redirect them to the dashboard page
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the requested page
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
}; 