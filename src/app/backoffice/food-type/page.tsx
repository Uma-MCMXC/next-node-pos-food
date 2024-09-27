'use client';

import React, { useState } from 'react'; // เพิ่มการนำเข้า useState
import MyModal from '../components/MyModal';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal

  const openModal = () => setIsOpen(true); // ฟังก์ชันเปิด modal
  const closeModal = () => setIsOpen(false); // ฟังก์ชันปิด modal

  return (
    <>
      <button
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Add
      </button>

      <MyModal
        id="modalFoodType"
        title="ประเภทอาหารและเครื่องดื่ม"
        isOpen={isOpen}
        onClose={closeModal}
      >
        <div className="mb-6">
          <label
            htmlFor="foodName"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            id="foodName"
            name="foodName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="note"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Note
          </label>
          <input
            type="text"
            id="note"
            name="note"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5"
        >
          Submit
        </button>
      </MyModal>
    </>
  );
}
