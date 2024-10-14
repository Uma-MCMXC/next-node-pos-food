'use client';

import React, { useEffect, useState } from 'react';
import MyModal from '../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal

  // ประกาศตัวแปร
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [foodType, setFoodTypes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันเปิด modal
  const openModal = (item: any = null) => {
    if (item) {
      // ถ้ามี item ให้ตั้งค่าข้อมูลสำหรับการแก้ไข
      setId(item.id);
      setName(item.name);
      setRemark(item.remark);
    } else {
      // ถ้าไม่มี item (เพิ่มข้อมูลใหม่)
      setId(0);
      setName('');
      setRemark('');
    }
    setIsOpen(true); // เปิด modal
  };

  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // food type create & edit
  const handleSave = async (e: any) => {
    e.preventDefault(); // ป้องกันการ submit ของ form
    try {
      const payload = {
        name: name,
        remark: remark,
        id: id,
      };

      if (id == 0) {
        // กรณีเพิ่มข้อมูลใหม่
        await axios.post(config.apiServer + '/api/foodType/create', payload);
      } else {
        // กรณีแก้ไขข้อมูล
        await axios.put(config.apiServer + '/api/foodType/update/', payload);
        setId(0); // รีเซ็ตค่า id หลังแก้ไข
      }

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

  // food type edit
  const edit = (item: any) => {
    setId(item.id);
    setName(item.name);
    setRemark(item.remark);
  };

  return (
    <>
      <h4 className="text-2xl font-bold dark:text-white mb-5 text-blue-800">
        Food Type
      </h4>

      <button
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => openModal()} // ปุ่มเพิ่ม
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
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.remark}</td>
              <td className="px-6 py-3">
                <div className="flex space-x-2">
                  <button
                    className="mb-4 bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => openModal(item)} // ปุ่มแก้ไข
                  >
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
        title={id === 0 ? 'Add Food Type' : 'Edit Food Type'}
        isOpen={isOpen} // เชื่อมต่อกับ state isOpen
        onClose={closeModal} // ปิด modal เมื่อกดปุ่ม close
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
