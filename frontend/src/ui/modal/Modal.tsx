import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import "twin.macro";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} tw="bg-blue-600">
      <Dialog.Panel>
        <Dialog.Title tw="bg-blue-600">Logout</Dialog.Title>
        <Dialog.Description>
          This will log you out of Aeolus Protocol
        </Dialog.Description>

        <button onClick={() => setIsOpen(false)}>Logout</button>
        <button onClick={() => {}}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
