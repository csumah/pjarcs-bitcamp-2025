import React from 'react';
import Navbar from '../components/Navbar';
import CalendarContent from '../components/CalendarContent';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

// This is your main page component for the Calendar view
export default function Calendar() {
  return (
    // Main flex container for the page layout
    <div className={`flex h-screen bg-white ${poppins.className}`}>
      {/* Render your Sidebar Navbar component */}
      <Navbar />

      {/* Render the Calendar Content component alongside the Navbar */}
      {/* This assumes CalendarContent handles the main content area styling (flex-1, padding, etc.) */}
      <CalendarContent />
    </div>
  );
}

// Note: Make sure the file containing the CalendarContent component code
// (from the 'calendar_component_refactored' document) is saved as 'CalendarContent.js'
// in the same directory as this 'Calendar.js' file, or adjust the import path accordingly.