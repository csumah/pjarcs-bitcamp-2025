'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Logo, { poppins } from '../components/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Group {
  id: number;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

export default function Homepage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load groups from localStorage
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(storedGroups);
  }, []);

  const handleGroupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    
    // Add zoom animation
    target.classList.add('scale-110', 'transition-transform', 'duration-300');
    
    // Navigate to groups page after animation
    setTimeout(() => {
      router.push('/groups');
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <Navbar />   
      {/* Main Content Area */}
      <div className={`${poppins.className} flex-1 flex flex-col p-6 sm:p-8 lg:p-10`}>
        {/* Header */}
        <div className="flex justify-end mb-8">
          <Logo />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Left Side: Groups on Top, Latest Activity Below */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl shadow bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] p-4 h-[280px] overflow-y-auto">
              <div className="text-white text-xl font-bold mb-4">Groups</div>
              {groups.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {groups.slice(0, 4).map((group) => (
                    <div 
                      key={group.id}
                      onClick={handleGroupClick}
                      className="bg-[#FFF5EE]/75 backdrop-blur-sm rounded-[24px] p-3 cursor-pointer hover:bg-[#FFF5EE]/90 transition-all h-[120px] flex flex-col justify-between"
                    >
                      <div>
                        <h3 className={`text-base font-semibold ${poppins.className} text-[#F4A460] truncate`}>
                          {group.name}
                        </h3>
                        <p className={`text-xs text-[#33333380] ${poppins.className} truncate mt-1`}>
                          {group.description}
                        </p>
                      </div>
                      <span className={`text-xs text-[#33333380]/50 ${poppins.className}`}>
                        {group.members.length} members
                      </span>
                    </div>
                  ))}
                  {groups.length > 4 && (
                    <div className="text-center text-white text-sm mt-2 col-span-2">
                      +{groups.length - 4} more groups
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-white text-center mt-4">
                  No groups yet. Create your first group!
                </div>
              )}
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
