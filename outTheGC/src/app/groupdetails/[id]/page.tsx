"use client"

import { FC, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Logo, { poppins } from '../../components/Logo';
import GroupService, { Group } from '../../services/groupService';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

interface Event {
  name: string;
  description: string;
  date: string;
  time: string;
  budget: string;
  splitBudget: boolean;
  members?: string[];
}

const GroupDetailsPage: FC = () => {
  const params = useParams();
  const groupId = Number(params.id);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Load group data using the service
    const currentGroup = GroupService.getGroupById(groupId);
    setGroup(currentGroup);
  }, [groupId]);

  if (!group) {
    return (
      <div className="flex min-h-screen bg-[#F5F5F5]">
        <Navbar />
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between">
            <h1 className={`ml-[125px] top-[45px] text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
              Group not found
            </h1>
            <Logo />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-6xl ml-[100px] font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
            {group.name}
          </h1>
          <Logo />
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Column */}
          <div className="flex-1 ml-[100px] max-w-[600px]">
            {/* Upcoming Plans */}
            <div
              className="rounded-[20px] h-[600px] mb-6"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <h2
                className="text-white font-inter font-bold ml-6"
                style={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Upcoming Plans
              </h2>

              {/* Event Box */}
              <div 
                className="flex flex-col items-center space-y-6 overflow-y-auto px-6" 
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#F7AE5A transparent'
                }}
              >
                {/* Create New Event Card */}
                <Link 
                  href={`/groups/create/event?groupId=${group.id}`}
                  className="block rounded-[24px] border-2 border-[#FFF5EE]/75 bg-transparent p-4 shadow-sm hover:bg-[#FFF5EE]/10 transition-colors no-underline text-inherit w-full"
                >
                  <div className="flex flex-col h-[150px] items-center justify-center">
                    <HiPlus className="h-12 w-12 text-[#FFF5EE]/75" />
                    <span className={`mt-2 text-[#FFF5EE]/75 text-lg ${poppins.className}`}>
                      Create New Event
                    </span>
                  </div>
                </Link>

                {/* Event Cards */}
                {group.event && (
                  <div className="bg-[#F5F5F5]/75 rounded-[24px] p-4 shadow-sm w-full">
                    <div className="flex flex-col h-[150px]">
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-1 ${poppins.className} text-[#F4A460] truncate`}>
                          {group.event.name}
                        </h3>
                        <p className={`text-sm text-[#333333]/50 ${poppins.className} line-clamp-2`}>
                          {group.event.description}
                        </p>
                        <div className={`mt-2 font-thin text-sm text-[#333333]/50 ${poppins.className}`}>
                          <p className="truncate">{group.event.date} at {group.event.time}</p>
                          {group.event.budget && <p className="truncate">Budget: ${group.event.budget}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-[#F4C998] border-2 border-white" />
                          <span className={`${poppins.className} ml-2 text-[#333333]/50 text-sm`}>
                            {group.event.members?.length || 0} members
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className={`${poppins.className} text-[#F4A460] text-sm font-medium`}>
                            Split: {group.event.splitBudget ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Box */}
            <div
              className="rounded-[20px] h-[400px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h2
                className="text-white font-inter font-bold ml-6"
                style={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Calendar
              </h2>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[400px] flex flex-col space-y-6">
            {/* Invite Friends Button */}
            <button
              className="bg-white text-[#F7AE5A] h-[70px] rounded-full flex items-center justify-start outline-none border-none transition-shadow duration-300 ease-in-out hover:shadow-2xl hover:bg-[#F4C998]/20"
              style={{
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src="/components/arrowthing.png" alt="Arrow Icon" className="w-12 h-12 ml-6" />
              <span
                className="font-inter font-bold leading-[100%] tracking-[0%] ml-4"
                style={{
                  fontWeight: 700,
                  fontSize: '24px',
                  color: '#F4C998',
                }}
              >
                Invite Friends
              </span>
            </button>

            {/* Members Box */}
            <div
              className="rounded-[20px] h-[662px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h2
                className="text-white font-inter font-bold ml-6"
                style={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Members
              </h2>

              {/* Member Boxes */}
              <div className="flex flex-col items-center space-y-4 p-6">
                {group.members.slice(0, 5).map((member: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-[20px] relative"
                    style={{
                      width: '360px',
                      height: '76px',
                      backgroundColor: '#F5F5F5',
                      opacity: 0.75,
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#F4C998',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '15px',
                        top: '13px',
                      }}
                    />
                    <span className="absolute left-[80px] top-[25px] text-gray-700 font-semibold">
                      {member}
                    </span>
                  </div>
                ))}
                {group.members.length > 5 && (
                  <button
                    className="text-white font-semibold text-lg hover:underline"
                    onClick={() => {
                      // Handle see more click
                    }}
                  >
                    See More
                  </button>
                )}
              </div>
            </div>

            {/* Finance Box */}
            <div
              className="rounded-[20px] h-[400px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h2
                className="text-white font-inter font-bold ml-6"
                style={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Finance
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage; 