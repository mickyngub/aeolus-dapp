import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import "twin.macro";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      tw="absolute top-0 z-50"
    >
      <div tw="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div tw="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel>
          <Dialog.Title tw="bg-blue-600">Logout</Dialog.Title>
          <Dialog.Description>
            This will log you out of Aeolus Protocol
          </Dialog.Description>

          <button onClick={() => setIsOpen(false)}>Logout</button>
          <button onClick={() => {}}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
