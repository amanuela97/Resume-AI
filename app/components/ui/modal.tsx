"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"; // Still using Headless UI for the dialog
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="mx-auto rounded-lg bg-white w-4/5 sm:w-1/2 md:w-1/3 lg:w-2/5">
          <div className="z-20">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
