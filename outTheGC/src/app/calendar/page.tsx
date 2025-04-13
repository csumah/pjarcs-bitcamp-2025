'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Logo, { poppins } from '../components/Logo';
import CalendarComponentWithAuth from '../components/CalendarContent';

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <div className={`${poppins.className} flex-1 flex flex-col p-6 sm:p-8 lg:p-10`}>
        <div className="flex justify-end mb-8">
          <Logo />
        </div>
        <div className="flex-1">
          <CalendarComponentWithAuth />
        </div>
      </div>
    </div>
  );
}

// Note: Make sure the file containing the CalendarContent component code
// (from the 'calendar_component_refactored' document) is saved as 'CalendarContent.js'
// in the same directory as this 'Calendar.js' file, or adjust the import path accordingly.