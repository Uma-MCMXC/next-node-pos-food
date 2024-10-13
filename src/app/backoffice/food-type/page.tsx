'use client';

import React, { useEffect, useState } from 'react';
import MyModal from '../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal

  // food type create
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');

  // food type lists
  const [foodType, setFoodTypes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => setIsOpen(true); // ฟังก์ชันเปิด modal
  const closeModal = () => setIsOpen(false); // ฟังก์ชันปิด modal

  // food type create
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

  // food type lists
  const fetchData = async () => {
    try {
      const rows = await axios.get(config.apiServer + '/api/foodType/list');
      setFoodTypes(rows.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  // food type remove
  const handleRemove = async (item: any) => {
    try {
      const button = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        await axios.delete(
          config.apiServer + '/api/foodType/remove/' + item.id,
        );
        fetchData();
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  return (
    <>
      <button
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Add
      </button>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Remark
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {foodType.map((item: any, index: number) => (
            <tr key={item.id} className="bg-white border-b">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.remark}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2 mb-4">
                  <button className="mb-4 bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                  <button
                    className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => handleRemove(item)}
                  >
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
