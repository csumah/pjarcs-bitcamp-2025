import React from 'react';
import Navbar from '../components/Navbar';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Homepage() {
  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
  {/* Left Side: Groups on Top, Latest Activity Below */}
  <div className="flex flex-col gap-6">
    <div className="rounded-xl shadow bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] p-4 h-[280px]">
      <div className={`${poppins.className} text-white text-xl font-bold mb-4`}>Groups</div>
      {/* Add groups content here */}
    </div>

    <div className="rounded-xl shadow bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] p-4 h-[300px] overflow-y-auto">
      <div className={`${poppins.className} text-xl font-bold text-white mb-4`}>Latest Activity</div>
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
      <div className={`${poppins.className} text-white font-semibold mb-2`}>Group 1</div>
      <div className="bg-white p-2 rounded shadow text-center text-sm text-gray-500">
        [ Calendar Placeholder ]
      </div>
    </div>

    <div>
      <div className={`${poppins.className} text-white font-semibold mb-2`}>Group 2</div>
      <div className="bg-white p-2 rounded shadow text-center text-sm text-gray-500">
        [ Calendar Placeholder ]
      </div>
    </div>
  </div>
</div>
    </div>
  );
};
