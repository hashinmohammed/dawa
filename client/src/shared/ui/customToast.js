import toast from "react-hot-toast";

const customToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#EF4444",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "#3B82F6",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default customToast;
