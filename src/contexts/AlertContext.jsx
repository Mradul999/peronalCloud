import { useContext, useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import { Alert } from "../components/Alert";

AlertProvider.propTypes = {
  children: PropTypes.node,
};

const AlertContext = createContext();

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (alert) {
      setTimeoutId(
        setTimeout(() => {
          setAlert(null);
        }, 2000)
      );
    }
  }, [alert]);

  function showAlert(className, message) {
    setAlert({ className: className, message: message });
  }

  const value = {
    showAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {alert && <Alert alert={alert} />}
      {children}
    </AlertContext.Provider>
  );
}
