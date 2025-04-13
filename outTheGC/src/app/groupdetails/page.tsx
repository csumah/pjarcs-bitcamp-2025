"use client"

import { FC } from 'react';
import Link from 'next/link';

const GroupDetailsPage: FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-16 bg-[#E4B684] flex flex-col items-center py-4 space-y-8">
        <Link href="/" className="text-white">
          <HomeIcon className="w-6 h-6" />
        </Link>
        <Link href="/groups" className="text-white">
          <GroupIcon className="w-6 h-6" />
        </Link>
        <Link href="/calendar" className="text-white">
          <CalendarIcon className="w-6 h-6" />
        </Link>
        <Link href="/create" className="text-white">
          <PlusIcon className="w-6 h-6" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-start mb-7 pr-10 pl-40">
          <h1 className="text-[64px] pr-64 font-bold text-[#F7AE5A] font-inter leading-[100%] tracking-[0%] [text-shadow:_0px_4px_4px_rgba(0,0,0,0.25)] ml-20">Group Name</h1>
          <div className="flex items-center space-x-4 mt-2 ">
            <p className="flex items-start text-[48px] font-bold text-[#F7AE5A] font-inter leading-[100%] tracking-[0%] [text-shadow:_0px_2px_4px_rgba(0,0,0,0.1)]">OutTheGC</p>
            <p className="text-[24px] font-bold text-[#F7AE5A] font-inter leading-[100%] tracking-[0%] mt-10 [text-shadow:_0px_2px_4px_rgba(0,0,0,0.1)]">making moves, for real.</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-16 pl-40">
          {/* Left Column */}
          <div className="flex flex-col space-y-8">
            {/* Upcoming Plans */}
            <div
              className="rounded-[20px] w-[605px] h-[954px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <h2
                className="text-white font-inter font-bold ml-10"
                style={{
                  fontWeight: 700,
                  fontSize: '40px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Upcoming Plans
              </h2>

              {/* White Boxes */}
              <div 
                className="flex flex-col items-center space-y-8 overflow-y-auto px-4" 
                style={{ 
                  height: 'calc(100% - 100px)',
                  paddingTop: '20px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#F7AE5A transparent'
                }}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg flex-shrink-0"
                    style={{
                      width: '490px',
                      height: '249px',
                      borderRadius: '15px',
                      backgroundColor: '#F5F5F5BF',
                      boxShadow: '6px 6px 12px 0px rgba(0, 0, 0, 0.3)',
                      marginBottom: index === 2 ? '20px' : '0'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Calendar Box */}
            <div
              className="rounded-[20px] w-[605px] h-[493px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h2
                className="text-white font-inter font-bold"
                style={{
                  fontWeight: 700,
                  fontSize: '40px',
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
          <div className="flex flex-col space-y-8 pr-20 pl-20">
            {/* Invite Friends Button */}
            <button
              className="bg-white text-[#F7AE5A] w-[402px] h-[86px] rounded-full flex items-center justify-start outline-none border-none transition-shadow duration-300 ease-in-out hover:shadow-2xl hover:bg-[#F4C998]/20"
              style={{
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src="/components/arrowthing.png" alt="Arrow Icon" className="w-16 h-16 ml-8" />
              <span
                className="font-inter font-bold leading-[100%] tracking-[0%] ml-4"
                style={{
                  fontWeight: 700,
                  fontSize: '32px',
                  color: '#F4C998',
                }}
              >
                Invite Friends
              </span>
            </button>

            {/* Members Box */}
            <div
              className="rounded-[20px] w-[442px] h-[662px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h2
                className="text-white font-inter font-bold"
                style={{
                  fontWeight: 700,
                  fontSize: '40px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  padding: '20px',
                }}
              >
                Members
              </h2>

              {/* Five Boxes with Increased Spacing */}
              <div className="flex flex-col items-center space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[20px] relative"
                    style={{
                      width: '392px',
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
                  </div>
                ))}
                <div
                  className="font-bold"
                  style={{
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textDecoration: 'underline',
                    textDecorationStyle: 'solid',
                    textUnderlineOffset: '3px',
                    textDecorationThickness: '1px',
                    color: 'white',
                    marginTop: '10px',
                    cursor: 'pointer'
                  }}
                >
                  See more
                </div>
              </div>
            </div>

            {/* Finance Box */}
            <div
              className="rounded-[20px] w-[442px] h-[662px]"
              style={{
                background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)',
                boxShadow: '4px 4px 9px 0px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Finance content can be added here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon components
const HomeIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const GroupIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CalendarIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowRightIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default GroupDetailsPage; 