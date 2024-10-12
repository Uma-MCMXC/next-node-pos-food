/* use client */
import React, { useState, useEffect } from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean; // Managed by parent
  onClose: () => void; // Managed by parent
}

const Modal: React.FC<ModalProps> = ({
  id,
  title,
  children,
  isOpen,
  onClose,
}) => {
  // Handle closing modal with "Escape" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent closing when clicking inside the modal content
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        id={id}
        tabIndex={-1}
        aria-hidden={!isOpen}
        className={`${isOpen ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full`}
      >
        {/* Overlay for clicking outside modal to close it */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div
          className="relative p-4 w-full max-w-2xl max-h-full z-10"
          onClick={stopPropagation}
        >
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
                aria-label="Close modal"
              >
                {/* Close button icon (SVG can be placed here) */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
