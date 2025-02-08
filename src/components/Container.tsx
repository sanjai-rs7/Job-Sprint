import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProp {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProp) => {
  return (
    <div
      className={cn("container mx-auto px-4 md:px-8 py-4 w-full", className)}
    >
      {children}
    </div>
  );
};
export default Container;
