'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get first day of month
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

const GroupCalendar = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState({});

  useEffect(() => {
    organizeEventsByDate(events);
  }, [events]);

  const organizeEventsByDate = (events) => {
    const organizedEvents = {};
    events.forEach(event => {
      const date = new Date(event.date);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!organizedEvents[dateKey]) {
        organizedEvents[dateKey] = [];
      }
      organizedEvents[dateKey].push(event);
    });
    setMonthEvents(organizedEvents);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-20 border border-white/20"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${month}-${i}`;
      const dayEvents = monthEvents[dateKey] || [];
      
      daysArray.push(
        <div key={i} className="h-20 border border-white/20 p-1 overflow-hidden">
          <div className="text-xs font-medium text-white">{i}</div>
          <div className="space-y-0.5 mt-0.5">
            {dayEvents.map((event, index) => (
              <div 
                key={`${i}-${index}`}
                className="text-xs bg-white/90 text-[#F4A460] rounded px-1 truncate"
                title={`${event.name} - ${event.time}`}
              >
                {event.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="h-full">
        <div className="p-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={prevMonth}
              className="p-1 hover:bg-white/10 rounded text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-base font-semibold text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-1 hover:bg-white/10 rounded text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0 flex-1">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-medium text-white py-1">
                {day}
              </div>
            ))}
            {daysArray}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {events.length > 0 ? (
        renderCalendar()
      ) : (
        <div className="text-white text-center py-4">No events planned yet</div>
      )}
    </div>
  );
};

export default GroupCalendar; 