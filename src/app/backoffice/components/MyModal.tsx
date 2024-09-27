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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div
        id={id}
        tabIndex={-1}
        aria-hidden={!isOpen}
        className={`${isOpen ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
                {/* SVG here */}
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">{children}</div>
          </div>
        </div>
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        ></div>
      </div>
    </>
  );
};

export default Modal;
