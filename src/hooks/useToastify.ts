import { toast, ToastOptions } from "react-toastify";

const useToastify = () => {
  const defaultOptions: ToastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const error = (msg: string) => {
    toast.error(msg, { ...defaultOptions, toastId: "error" });
  };

  const success = (msg: string) => {
    toast.success(msg, { ...defaultOptions, toastId: "success" });
  };

  return { error, success };
};

export default useToastify;
