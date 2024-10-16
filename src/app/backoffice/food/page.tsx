'use client';

import { useEffect, useState } from 'react';
import MyModal from '../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะ modal

  const [foodTypeId, setFoodTypeId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState('');
  const [myFile, setMyFile] = useState<File | null>(null);
  const [foodType, setFoodType] = useState('food');

  useEffect(() => {
    fetchDateFoodTypes();
    fetchData();
  }, []);

  const openModal = (item: any = null) => {
    if (item) {
      setId(item.id);
      setName(item.name);
      setRemark(item.remark);
      setFoodTypeId(item.foodTypeId);
      setPrice(item.price);
      setImg(item.img);
      setFoodType(item.foodType);
    } else {
      setId(0);
      setName('');
      setRemark('');
      setFoodTypeId(0);
      setPrice(0);
      setImg('');
      setFoodType('');
    }
    setIsOpen(true); // เปิด modal
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/food/list');
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  const fetchDateFoodTypes = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/foodType/list');

      if (res.data.results.length > 0) {
        setFoodTypes(res.data.results);
        setFoodTypeId(res.data.results[0].id);
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  const handleSelectedFile = (e: any) => {
    if (e.target.files.length > 0) {
      setMyFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const img = await handleUpload();
      const payload = {
        foodTypeId: foodTypeId,
        name: name,
        remark: remark,
        price: price,
        img: img,
        id: id,
        foodType: foodType,
      };

      if (id == 0) {
        const res = await axios.post(
          config.apiServer + '/api/food/create',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        const res = await axios.put(
          config.apiServer + '/api/food/update',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        setId(0);
      }

      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูล',
        text: 'บันทึกข้อมูลสำเร็จ',
        timer: 1500,
      });

      fetchData();
      closeModal();
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const handleUpload = async () => {
    try {
      if (!myFile) {
        throw new Error('No file selected'); // ตรวจสอบว่าไฟล์ถูกเลือกหรือไม่
      }

      const formData = new FormData();
      formData.append('myFile', myFile);

      const res = await axios.post(
        config.apiServer + '/api/food/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return res.data.fileName;
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const getFoodTypeName = (foodType: string): string => {
    if (foodType == 'food') {
      return 'อาหาร';
    } else {
      return 'เครื่องดื่ม';
    }
  };

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
        await axios.delete(config.apiServer + '/api/food/remove/' + item.id);
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

  const edit = (item: any) => {
    setId(item.id);
    setFoodTypeId(item.foodTypeId);
    setName(item.name);
    setRemark(item.remark);
    setPrice(item.price);
    setFoodType(item.foodType);
    setImg(item.img);
  };

  return (
    <>
      <h4 className="text-2xl font-bold dark:text-white mb-5 text-blue-800">
        Food
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
              img
            </th>
            <th scope="col" className="px-6 py-3">
              Food Type
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Remark
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {foods.map((item: any, index: number) => (
            <tr key={item.id} className="bg-white border-b">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">
                <img
                  src={config.apiServer + '/uploads/' + item.img}
                  alt={item.name}
                  width="80"
                />
              </td>
              <td className="px-6 py-3">{item.FoodType.name}</td>
              <td className="px-6 py-3">{getFoodTypeName(item.foodType)}</td>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.remark}</td>
              <td className="px-6 py-3">{item.price}</td>
              <td className="px-6 py-3">
                <div className="flex space-x-2">
                  <button
                    className="mb-4 bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => openModal(item)}
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
        id="modalFood"
        title={id === 0 ? 'Add Food' : 'Edit Food'}
        isOpen={isOpen} // เชื่อมต่อกับ state isOpen
        onClose={closeModal} // ปิด modal เมื่อกดปุ่ม close
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
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
              Img
            </label>
            {img != '' && (
              <img
                className="mb-2"
                src={config.apiServer + '/uploads/' + img}
                alt={name}
                width="100"
              />
            )}
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => handleSelectedFile(e)}
              type="file"
            />
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
          <div className="mb-6">
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Price
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              type="number"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Food Type
            </label>
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <input
                type="radio"
                name="foodType"
                value="food"
                checked={foodType === 'food'}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Food
              </label>

              <input
                type="radio"
                name="foodType"
                value="drink"
                checked={foodType === 'drink'}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Drink
              </label>
            </div>
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
