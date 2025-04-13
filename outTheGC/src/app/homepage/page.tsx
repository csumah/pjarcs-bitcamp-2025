import React from 'react';
import Navbar from '../components/Navbar';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Homepage() {
  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <Navbar />   
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <div className="top-[45px] flex items-center">
            <Image
                src="/component/logo.png"
                alt="OutTheGC Logo"
                width={140}
                height={140}
                className="w-50 h-50"
              />
            <div className="flex flex-col mr-4">
              <h1 className={`text-5xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                OutTheGC
              </h1>
              <p className={`${poppins.className} text-[#F4A460] mt-2 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                making moves, for real.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Left Side: Groups on Top, Latest Activity Below */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl shadow bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] p-4 h-[280px]">
              <div className="text-white text-xl font-bold mb-4">Groups</div>
              {/* Add groups content here */}
            </div>
            
            <div className="rounded-xl shadow bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] p-4 h-[300px] overflow-y-auto">
              <div className="text-xl font-bold text-[#F5F5F5] mb-4">Latest Activity</div>
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center bg-orange-50 p-3 rounded-xl mb-2 shadow"
                >
                  <div className="w-6 h-6 bg-orange-300 rounded-full mr-4" />
                  <div className="h-4 bg-orange-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Calendars */}
          <div className="rounded-xl shadow bg-gradient-to-br from-[#F4C998] to-[#F7AE5A] p-4 h-full">
            <div className="text-white text-xl font-bold mb-4">Calendars</div>

            <div className="mb-6">
              <div className="text-white font-semibold mb-2">Group 1</div>
              <div className="bg-white p-2 rounded shadow text-center text-sm text-gray-500">
                [ Calendar Placeholder ]
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-2">Group 2</div>
              <div className="bg-white p-2 rounded shadow text-center text-sm text-gray-500">
                [ Calendar Placeholder ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
