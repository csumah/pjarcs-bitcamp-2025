'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Logo, { poppins } from '../../../components/Logo';

export default function CreateEvent() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [budget, setBudget] = useState('');
  const [splitBudget, setSplitBudget] = useState<'yes' | 'no' | null>(null);

  const handleSubmit = () => {
    if (!eventName.trim() || !startDate) return;
    if (endTime && !startTime) return; // Can't have end time without start time

    // Get the most recently created group
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const currentGroup = groups[groups.length - 1];

    // Add event details to the group
    const updatedGroup = {
      ...currentGroup,
      event: {
        name: eventName,
        description,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        budget: budget || '0',
        splitBudget: splitBudget === 'yes',
      },
    };

    // Update the group in localStorage
    groups[groups.length - 1] = updatedGroup;
    localStorage.setItem('groups', JSON.stringify(groups));

    // Navigate to the groups page
    router.push('/groups');
  };

  const isCreateDisabled = Boolean(!eventName || eventName.trim() === '' || !startDate || (endTime && !startTime));

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar - Orange */}
      <Navbar />
      
        <div className="flex-1 bg-[#F5F5F5] p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className={`ml-[125px] top-[45px] text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                    Create Event
                </h1>

                <Logo />
            </div>
            <div className="max-w-2xl mx-auto">
                {/* Event Form */}
                <div className="space-y-6">
                    {/* Event Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name your first event"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add description... (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                        />
                    </div>

                    {/* Date & Time Section */}
                    <div className="space-y-6">
                        <h3 className={`text-[#F4A460] text-xl font-semibold ${poppins.className}`}>
                            Date & Time
                        </h3>
                    
                        {/* Date Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[#999] mb-2 text-sm">Start Date*</p>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-[#999] mb-2 text-sm">End Date (Optional)</p>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                                />
                            </div>
                        </div>

                        {/* Time Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[#999] mb-2 text-sm">Start Time (Optional)</p>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                                />
                            </div>
                            <div>
                                <p className="text-[#999] mb-2 text-sm">End Time (Optional)</p>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => {
                                        if (!startTime && e.target.value) {
                                            alert('Please set a start time first');
                                            return;
                                        }
                                        setEndTime(e.target.value);
                                    }}
                                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget Section */}
                    <div className="space-y-6">
                        <h3 className={`text-[#F4A460] text-xl font-semibold ${poppins.className}`}>
                            Budget
                        </h3>
                    
                        <input
                            type="number"
                            placeholder="Set budget (optional)"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                        />

                        {/* Only show split budget options when budget has a value */}
                        {budget && budget !== '0' && (
                            <div className="space-y-2 transition-all duration-300">
                                <p className="text-[#999]">Split budget</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                        type="radio"
                                        name="splitBudget"
                                        checked={splitBudget === 'yes'}
                                        onChange={() => setSplitBudget('yes')}
                                        className="text-[#F4A460] focus:ring-[#F4A460]"
                                        />
                                        <span className="text-[#999]">Yes</span>
                                    </label>
                                
                                    <label className="flex items-center space-x-2">
                                        <input
                                        type="radio"
                                        name="splitBudget"
                                        checked={splitBudget === 'no'}
                                        onChange={() => setSplitBudget('no')}
                                        className="text-[#F4A460] focus:ring-[#F4A460]"
                                        />
                                        <span className="text-[#999]">No</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Create Event Button */}
                    <button
                    onClick={handleSubmit}
                    disabled={isCreateDisabled}
                    className={`w-full py-4 text-lg rounded-full font-semibold transition-all duration-200 shadow-md mt-8
                        ${isCreateDisabled 
                        ? 'bg-[#999] cursor-not-allowed opacity-50' 
                        : 'bg-[#F4A460] hover:bg-[#E38B4F] text-white'
                        }`}
                    >
                    Create Event
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
} 