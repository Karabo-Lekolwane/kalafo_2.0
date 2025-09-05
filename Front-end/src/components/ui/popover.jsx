// ui/popover.jsx
import React, { useState } from 'react';
import { cn } from '../lib/utils';

const PopoverContext = React.createContext({});

const Popover = React.forwardRef(({ className, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} className={cn("relative inline-block", className)} {...props} />
    </PopoverContext.Provider>
  );
});
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const { setIsOpen } = React.useContext(PopoverContext);

  return (
    <button
      ref={ref}
      className={cn("", className)}
      onClick={() => setIsOpen(prev => !prev)}
      {...props}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ className, ...props }, ref) => {
  const { isOpen } = React.useContext(PopoverContext);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className
      )}
      {...props}
    />
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };