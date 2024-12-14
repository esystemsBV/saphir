"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, placeholder, defaultValue, value, onChange, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const id = React.useId();

    React.useEffect(() => {
      setHasValue(!!defaultValue || !!value);
    }, [defaultValue, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== "");
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border focus:outline-main focus:outline-1 border-gray-300 bg-background px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent disabled:cursor-not-allowed disabled:opacity-50",
            (isFocused || hasValue) && " pt-2",
            className
          )}
          ref={ref}
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value !== "");
          }}
          onChange={handleChange}
          {...props}
        />
        {placeholder && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 pointer-events-none",
              (isFocused || hasValue) &&
                "text-xs left-3 -top-2 bg-white px-1 -translate-y-0 text-main",
              hasValue && !isFocused && "text-gray-500"
            )}
          >
            {placeholder}
          </label>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
