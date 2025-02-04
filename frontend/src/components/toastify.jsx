import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastTheme = {
  backgroundColor: '#1e293b', // Dark gray (slate) background
  color: '#00ffff',          // Cyan text
  border: '1px solid #00bcd4', // Cyan border
};

// Success notification
export function showSuccessToast(message) {
  toast.success(message, {
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: toastTheme,
  });
}

// Error notification
export const showErrorToast = (message) => {
  toast.error(message, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...toastTheme,
      color: '#ff5252', // Red text for errors
    },
  });
}

// Info notification
export const showInfoToast = (message) => {
  toast.info(message, {
    autoClose: 4000,
    style: toastTheme,
  });
}

// Custom styled notification
export const showCustomToast = (data) => {
  toast(data, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: toastTheme,
  });
}

// Loader notification
export const showLoaderToast = (message) => {
  toast.loading(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: toastTheme,
  });
};


export const showPromiseToast = async (promise, messages) => {
  try {
    await toast.promise(promise, {
      ...messages,
      style: toastTheme,
    });
  } catch (error) {
    showErrorToast("Error fetching data. Please try again.");
    console.error("Error fetching data:", error);
  }
};