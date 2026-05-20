import React, { useCallback, useState } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

// Toast Context
export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="me-2" style={{ color: '#10B981' }} />;
      case 'error':
        return <XCircle size={20} className="me-2" style={{ color: '#EF4444' }} />;
      case 'warning':
        return <AlertCircle size={20} className="me-2" style={{ color: '#F59E0B' }} />;
      default:
        return <Info size={20} className="me-2" style={{ color: '#3B82F6' }} />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return '#D1FAE5';
      case 'error':
        return '#FEE2E2';
      case 'warning':
        return '#FEF3C7';
      default:
        return '#DBEAFE';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return '#065F46';
      case 'error':
        return '#7F1D1D';
      case 'warning':
        return '#78350F';
      default:
        return '#1E40AF';
    }
  };

  return (
    <div
      className="toast d-flex align-items-center mb-2 shadow-sm"
      style={{
        backgroundColor: getBgColor(),
        color: getTextColor(),
        borderRadius: '8px',
        minWidth: '300px',
        border: 'none'
      }}
      role="alert"
    >
      <div className="toast-body d-flex align-items-center w-100">
        {getIcon()}
        <span className="flex-grow-1">{toast.message}</span>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          style={{ opacity: 0.7 }}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};
