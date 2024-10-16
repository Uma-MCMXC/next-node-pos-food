'use client';

import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Page() {
  const [table, setTable] = useState(1);
  const [foods, setFoods] = useState([]);
  const [saleTemps, setSaleTemps] = useState([]);
  const myRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFoods();
    fetchDataSaleTemp();
    (myRef.current as HTMLInputElement).focus();
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
      fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const fetchDataSaleTemp = async () => {
    try {
      const res = await axios.get(config.apiServer + '/api/saleTemp/list');
      setSaleTemps(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const removeSaleTemp = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: 'คุณต้องการลบรายการนี้ ?',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        const payload = {
          tableNo: table,
          userId: Number(localStorage.getItem('next_user_id')),
        };

        await axios.delete(config.apiServer + '/api/saleTemp/remove' + id);
        fetchDataSaleTemp();
      }
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const updateQty = async (id: number, qty: number) => {
    try {
      const payload = {
        qty: qty,
        id: id,
      };

      await axios.put(config.apiServer + '/api/saleTemp/updateQty', payload);
      fetchDataSaleTemp();
    } catch (e: any) {
      Swal.fire({
        title: 'Error',
        text: e.response.data?.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const removeAllSaleTemp = async (id: number) => {};

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
              ref={myRef}
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
              Drink
            </button>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => filterFoods('all')}
            >
              All
            </button>
            <button
              onClick={() => removeAllSaleTemp}
              disabled={saleTemps.length === 0}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-10 flex h-screen gap-5">
          {/* Left Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 col-span-2 flex-grow">
            {foods.map((food: any) => (
              <div
                key={food.id}
                className="bg-white border border-gray-200 rounded-lg shadow max-w-sm"
              >
                <img
                  className="rounded-t-lg w-full"
                  src={config.apiServer + '/uploads/' + food.img}
                  alt={food.name}
                  style={{ height: '190px', objectFit: 'cover' }}
                  onClick={() => sale(food.id)}
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

          {/* Right Section */}
          <div className="flex flex-col flex-shrink-0 bg-white h-screen overflow-y-auto w-96">
            <div className="sticky top-0 bg-white z-10">
              <div className="text-right mb-3">
                <div className="bg-gray-800 text-white text-2xl p-4 rounded-lg">
                  0.00
                </div>
              </div>
            </div>
            {saleTemps.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
              >
                <h2 className="font-semibold text-lg">{item.Food.name}</h2>
                <p className="text-sm text-gray-700">
                  {item.Food.price} x {item.qty} = {item.Food.price * item.qty}
                </p>

                {/* qty */}
                <div className="relative flex items-center mt-5 max-w-full">
                  <button
                    type="button"
                    onClick={(e) => updateQty(item.id, item.qty - 1)}
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>

                  <input
                    type="text"
                    readOnly
                    className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={item.qty}
                    id="quantity-input"
                    data-input-counter
                    aria-describedby="helper-text-explanation"
                  />

                  <button
                    type="button"
                    onClick={(e) => updateQty(item.id, item.qty + 1)}
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    onClick={(e) => removeSaleTemp(item.id)}
                  >
                    Cancel
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
