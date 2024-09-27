'use client';

import { useEffect, useState } from 'react';

// sign out
import Swal from 'sweetalert2';
import config from '@/app/config';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [name, setName] = useState(' ');

  // sign out
  const router = useRouter();
  const signOut = async () => {
    try {
      const button = await Swal.fire({
        title: 'Sign Out',
        text: 'คุณต้องการออกจากระบบ',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        localStorage.removeItem(config.token);
        localStorage.removeItem('next_name');
        localStorage.removeItem('next_user_id');

        router.push('/signin');
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('next_name');
    setName(name ?? '');
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <a className="flex ms-2 md:me-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Next.js Workshop
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <p className="text-md text-blue-800 font-extrabold dark:text-white me-4">
                {name}
              </p>
              <button
                onClick={signOut}
                className="text-sm text-red-700 font-extrabold"
              >
                (Sign Out)
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
