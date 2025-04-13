'use client';

import { useState, useEffect } from 'react';
import { HiPlus } from "react-icons/hi";
import { HiTrash } from "react-icons/hi";
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Logo, { poppins } from '../components/Logo';

interface Group {
  id: number;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Load groups from localStorage on component mount
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    setGroups(storedGroups);
  }, []);

  // Listen for storage events to update groups when they're modified in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      setGroups(storedGroups);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDeleteGroup = (groupId: number) => {
    // Filter out the group to be deleted
    const updatedGroups = groups.filter(group => group.id !== groupId);
    
    // Update state
    setGroups(updatedGroups);
    
    // Update localStorage
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  return (
    <div className="min-h-screen relative bg-[#F5F5F5]">
      {/** Navigation Bar **/}
      <Navbar />
      
      {/** Main Body **/}
      <main className="flex-1 p-4 sm:p-8 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className={`ml-[100px] text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
            Groups
          </h1>
          <Logo />
        </div>

        {/** Group Cards **/}
        <div className="ml-[125px] mx-4 sm:mx-[45px] p-4 sm:p-6 md:p-8">
          <div className="bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] rounded-[32px] p-4 sm:p-6 md:p-8 min-h-[600px]">
            {/** Individual Cards **/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {groups.map((group) => (
                <div key={group.id} className="relative">
                  <Link href={`/groupdetails/${group.id}`} 
                    className="block bg-[#F5F5F5]/75 backdrop-blur-sm rounded-[24px] shadow-sm p-4 sm:p-6 md:p-8 mt-[25px] mx-[5px] hover:shadow-md transition-shadow no-underline text-inherit">
                    <div className="h-[150px] flex flex-col justify-between items-center text-center mx-[10px]">
                      <div>
                        <h3 className={`text-xl sm:text-2xl md:text-[25px] font-semibold mb-2 ${poppins.className} text-[#F4A460]`}>
                          {group.name}
                        </h3>
                        <p className={`text-xs sm:text-sm text-[#33333380] ${poppins.className}`}>
                          {group.description}
                        </p>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((member: string, index: number) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full bg-[#F4C998] border-2 border-white"
                            />
                          ))}
                          {group.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-[#F4C998] border-2 border-white flex items-center justify-center text-white text-xs">
                              +{group.members.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="ml-2 text-[#333333]/50 text-sm">
                          {group.members.length} members
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                    title="Delete group"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Create New Group Card */}
              <Link href="/groups/create" 
                className="block rounded-[24px] border-2 border-[#FFF5EE]/75 bg-transparent p-4 sm:p-6 md:p-8 mt-[25px] mx-[5px] flex items-center justify-center hover:bg-[#FFF5EE]/10 transition-colors no-underline text-inherit">
                <div className="flex items-center justify-center h-[150px] w-auto">
                  <HiPlus className="h-[80px] sm:h-[100px] w-6 sm:w-8 text-[#FFF5EE]/75 mx-auto" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}