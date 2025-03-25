import toast from 'react-hot-toast';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Toast styles for different types
const toastStyles = {
  [TOAST_TYPES.SUCCESS]: {
    icon: '✅',
    style: {
      background: '#10B981',
      color: 'white',
    }
  },
  [TOAST_TYPES.ERROR]: {
    icon: '❌',
    style: {
      background: '#EF4444',
      color: 'white',
    }
  },
  [TOAST_TYPES.INFO]: {
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: 'white',
    }
  },
  [TOAST_TYPES.WARNING]: {
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: 'white',
    }
  }
};

// Toast configuration
const toastConfig = {
  duration: 3000,
  position: 'top-center',
};

/**
 * Show a toast notification
 * @param {string} type - The type of toast (success, error, info, warning)
 * @param {string} message - The message to display
 * @param {Object} options - Additional options to pass to toast
 */
export const showToast = (type, message, options = {}) => {
  const { icon, style } = toastStyles[type] || toastStyles[TOAST_TYPES.INFO];
  
  return toast(message, {
    ...toastConfig,
    ...options,
    icon,
    style: {
      ...style,
      ...options.style,
    },
  });
};

// Convenience methods
export const showSuccessToast = (message, options = {}) => showToast(TOAST_TYPES.SUCCESS, message, options);
export const showErrorToast = (message, options = {}) => showToast(TOAST_TYPES.ERROR, message, options);
export const showInfoToast = (message, options = {}) => showToast(TOAST_TYPES.INFO, message, options);
export const showWarningToast = (message, options = {}) => showToast(TOAST_TYPES.WARNING, message, options);

// Dismiss all toasts
export const dismissAllToasts = () => toast.dismiss(); 