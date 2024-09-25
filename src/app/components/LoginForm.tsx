'use client';
import React from 'react';

const LoginForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // จัดการการส่งฟอร์มที่นี่
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <p className="font-extrabold text-purple-950 text-2xl">
            Next.js + Node
          </p>
          <p className="text-gray-700">Workshop</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
