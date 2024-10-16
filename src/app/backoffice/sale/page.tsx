'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [table, setTable] = useState(1);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/food/list`);
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const filterFoods = async (foodType: string) => {
    try {
      const res = await axios.get(
        `${config.apiServer}/api/food/filter/${foodType}`,
      );
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  // save
  const sale = async (foodId: number) => {
    try {
      const payload = {
        tableNo: table,
        userId: Number(localStorage.getItem('next_user_id')),
        foodId: foodId,
      };
      await axios.post(config.apiServer + '/api/saleTemp/create', payload);
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <h4 className="text-2xl font-bold dark:text-white mb-5 text-blue-800">
        Sell Products
      </h4>

      <div className="max-w-full p-6 bg-white border border-gray-300 rounded-lg">
        <div className="flex space-x-5">
          <div className="flex max-w-sm">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
              Table
            </span>
            <input
              type="text"
              className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
              value={table}
              onChange={(e) => setTable(Number(e.target.value))}
            />
          </div>

          <div>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => filterFoods('food')}
            >
              Food
            </button>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => filterFoods('drink')}
            >
              DrinK
            </button>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => filterFoods('all')}
            >
              All
            </button>
            <button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Reset
            </button>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 col-span-2">
            {foods.map((food: any) => (
              <div
                key={food.id} // อย่าลืมใส่ key เพื่อช่วย React ในการจัดการรายการ
                className="bg-white border border-gray-200 rounded-lg shadow"
              >
                <img
                  className="rounded-t-lg w-full"
                  src={config.apiServer + '/uploads/' + food.img}
                  alt={food.name}
                  style={{ height: '150px', objectFit: 'cover' }}
                  onClick={(e) => sale(food.id)}
                />
                <div className="p-4">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {food.name}
                  </h2>
                  <p className="mb-3 font-extrabold text-blue-700 text-lg">
                    {new Intl.NumberFormat('en-US', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(food.price)}{' '}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-right mb-3">
              <div className="bg-gray-800 text-white text-2xl p-4 rounded-lg">
                0.00
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="font-semibold text-lg">Food Name</h2>
              <p className="text-sm text-gray-700">100 x 2 = 200</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Cancel
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
