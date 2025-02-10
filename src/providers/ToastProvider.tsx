import { Toaster } from "@/components/ui/sonner";

const ToastProvider = () => {
  return (
    <Toaster
      theme="light"
      richColors
      position="top-right"
      className="bg-neutral-300 shadow-lg"
    />
  );
};

export default ToastProvider;
