import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { IconButton } from "./IconButton.js";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-ledger-900/20 backdrop-blur-[1px] transition-opacity duration-200" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-paper-0 p-6 shadow-float border-l border-line flex flex-col focus:outline-none transition-transform duration-240 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "overflow-y-auto"
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
            <div>
              <DialogPrimitive.Title className="font-serif text-[1.4375rem] font-semibold text-ledger-900">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="font-sans text-[0.875rem] text-ledger-700 mt-0.5">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton aria-label="Close drawer">
                <X className="w-5 h-5" />
              </IconButton>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 flex flex-col">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
