'use client';

import { useEffect, useState } from 'react';
import MyModal from '../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [id, setId] = useState(0);
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [moneyAdded, setMoneyAdded] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodSizes, setFoodSizes] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDateFoodSizes();
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

  const fetchData = async () => {};

  const fetchDateFoodSizes = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/foodType/list');
      setFoodTypes(res.data.results);
      setFoodTypeId(res.data.results[0].id);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  const edit = (item: any) => {};

  const remove = (item: any) => {};

  const save = async () => {
    const payload = {
      name: name,
      remark: remark,
      id: id,
      foodTypeId: foodTypeId,
      moneyAdded: moneyAdded,
    };
    await axios.post(config.apiServer + '/api/foodSize/create', payload);
    fetchData();

    document.getElementById('modalFoodSize_btnClose')?.click();
  };

  const clearForm = () => {};

  return (
    <>
      <h4 className="text-2xl font-bold dark:text-white mb-5 text-blue-800">
        Food Size
      </h4>
      <button
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => openModal()}
      >
        Add
      </button>

      <MyModal
        id="modalFoodSize"
        title={id === 0 ? 'Add Food Size' : 'Edit Food Size'}
        isOpen={isOpen} // เชื่อมต่อกับ state isOpen
        onClose={closeModal} // ปิด modal เมื่อกดปุ่ม close
      >
        <form onSubmit={save}>
          <div className="mb-6">
            <label
              htmlFor="foodName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Food Type
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setFoodTypeId(parseInt(e.target.value))}
            >
              <option value="" disabled>
                Choose a country
              </option>
              {foodTypes.map((item: any) => (
                <option key={item.id} value="{item.id}">
                  {item.name}
                </option>
              ))}
            </select>
          </div>

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
              htmlFor="moneyAdded"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Money
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={moneyAdded}
              type="member"
              onChange={(e) => setMoneyAdded(parseInt(e.target.value))}
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
