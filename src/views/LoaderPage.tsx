import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const LoaderPage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-transparent z-50",
        className
      )}
    >
      <Loader className="size-10 text-purple-500 animate-spin object-cover" />
    </div>
  );
};

export default LoaderPage;
