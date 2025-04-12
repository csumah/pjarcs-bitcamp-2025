import React from 'react';
import Navbar from '../components/Navbar';

export default function Homepage() {
  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      {/* 
      <div className="w-32 bg-gradient-to-b from-orange-300 to-orange-500 flex flex-col items-center py-4 rounded-tr-3xl rounded-br-3xl">
        <button className="my-4 p-2 bg-white rounded-full shadow-md">
          <span className="text-orange-500">🏠</span>
        </button>
        <button className="my-4 p-2">
          <span className="text-white">👥</span>
        </button>
        <button className="my-4 p-2">
          <span className="text-white">📅</span>
        </button>
        <button className="mt-auto mb-4 p-2 bg-white rounded-full shadow-md">
          <span className="text-orange-500">➕</span>
        </button>
      </div>
        */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
  {/* Left Side: Groups on Top, Latest Activity Below */}
  <div className="flex flex-col gap-6">
    <div className="rounded-xl shadow bg-gradient-to-br from-orange-200 to-orange-400 p-4 h-[280px]">
      <div className="text-white text-xl font-bold mb-4">Groups</div>
      {/* Add groups content here */}
    </div>

    <div className="rounded-xl shadow bg-orange-100 p-4 h-[300px] overflow-y-auto">
      <div className="text-xl font-bold text-orange-700 mb-4">Latest Activity</div>
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
  <div className="rounded-xl shadow bg-gradient-to-br from-orange-200 to-orange-400 p-4 h-full">
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
  );
};
