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
      setFoodTypeId(item.foodTypeId);
      setMoneyAdded(item.moneyAdded);
    } else {
      // ถ้าไม่มี item (เพิ่มข้อมูลใหม่)
      setId(0);
      setName('');
      setRemark('');
      setFoodTypeId(0);
      setMoneyAdded(0);
    }
    setIsOpen(true); // เปิด modal
  };

  // ฟังก์ชันปิด modal
  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/foodSize/list');
      setFoodSizes(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

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

  const edit = (item: any) => {
    setFoodTypeId(item.foodTypeId);
    setId(item.id);
    setMoneyAdded(item.moneyAdded);
    setName(item.name);
    setRemark(item.remark);
  };

  const remove = async (item: any) => {
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
          config.apiServer + '/api/foodSize/remove/' + item.id,
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

  const save = async (e: any) => {
    e.preventDefault(); // ป้องกันการ refresh หน้าเว็บ
    const payload = {
      name: name,
      remark: remark,
      id: id,
      foodTypeId: foodTypeId,
      moneyAdded: moneyAdded,
    };
    try {
      if (id == 0) {
        await axios.post(config.apiServer + '/api/foodSize/create', payload);
      } else {
        await axios.put(config.apiServer + '/api/foodSize/update/', payload);
        setId(0); // รีเซ็ตค่า id หลังแก้ไข
      }
      fetchData(); // ดึงข้อมูลใหม่
      closeModal(); // ปิด modal
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

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

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Food Type
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Remark
            </th>
            <th scope="col" className="px-6 py-3">
              Money Added
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {foodSizes.map((item: any, index: number) => (
            <tr key={item.id} className="bg-white border-b">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{item.FoodType.name}</td>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.remark}</td>
              <td className="px-6 py-3">{item.moneyAdded}</td>
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
                    onClick={(e) => remove(item)}
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
              value={foodTypeId}
            >
              <option value="">Choose a country</option>
              {foodTypes.map((item: any) => (
                <option key={item.id} value={item.id}>
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
              type="number"
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
