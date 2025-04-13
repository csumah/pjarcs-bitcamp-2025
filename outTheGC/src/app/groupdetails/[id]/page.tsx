"use client"

import { FC, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Logo, { poppins } from '../../components/Logo';
import GroupService, { Group } from '../../services/groupService';

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
      <div className="flex min-h-screen bg-white">
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
    <div className="flex min-h-screen bg-white">
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
              {group.event && (
                <div 
                  className="flex flex-col items-center space-y-6 overflow-y-auto px-6" 
                  style={{ 
                    height: 'calc(100% - 80px)',
                    paddingTop: '20px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#F7AE5A transparent'
                  }}
                >
                  <div
                    className="rounded-lg flex-shrink-0"
                    style={{
                      width: '80%',
                      height: '200px',
                      borderRadius: '15px',
                      backgroundColor: '#F5F5F5BF',
                      boxShadow: '6px 6px 12px 0px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#F4A460] mb-3">{group.event.name}</h3>
                      <p className="text-gray-600 mb-4">{group.event.description}</p>
                      <div className="text-gray-700 text-sm">
                        <p>Date: {group.event.date}</p>
                        <p>Time: {group.event.time}</p>
                        {group.event.budget && <p>Budget: ${group.event.budget}</p>}
                        <p>Split Budget: {group.event.splitBudget ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                      backgroundColor: 'rgba(245, 245, 245, 0.75)',
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