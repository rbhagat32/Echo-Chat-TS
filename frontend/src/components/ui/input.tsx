import * as React from "react";

import { cn } from "@/lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface PropTypes extends React.ComponentProps<"input"> {
  register?: UseFormRegisterReturn;
}

function Input({ register, className, type, ...props }: PropTypes) {
  return (
    <input
      {...register}
      type={type}
      data-slot="input"
      autoComplete="off"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-indigo-500 focus:ring",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
