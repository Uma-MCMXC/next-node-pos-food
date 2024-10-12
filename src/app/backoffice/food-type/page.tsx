'use client';

import React, { useState } from 'react';
import MyModal from '../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');

  const openModal = () => setIsOpen(true); // ฟังก์ชันเปิด modal
  const closeModal = () => setIsOpen(false); // ฟังก์ชันปิด modal

  const handleSave = async (e: any) => {
    e.preventDefault(); // ป้องกันการ submit ของ form
    try {
      const payload = {
        name: name,
        remark: remark,
      };

      await axios.post(config.apiServer + '/api/foodType/create', payload);
      fetchData();
      closeModal(); // ปิด modal หลังจากบันทึกสำเร็จ
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.message || 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const fetchData = async () => {
    // Fetch data logic here (ถ้ามี)
  };

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
        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label
              htmlFor="foodName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Remark
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5"
          >
            Submit
          </button>
        </form>
      </MyModal>
    </>
  );
}
