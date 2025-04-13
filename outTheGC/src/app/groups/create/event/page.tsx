'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Logo, { poppins } from '../../../components/Logo';
import GroupService from '../../../services/groupService';
import EventService from '../../../services/eventService';

export default function CreateEvent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  
  const [eventName, setEventName] = useState(searchParams.get('name') || '');
  const [description, setDescription] = useState(searchParams.get('description') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [startDate, setStartDate] = useState(searchParams.get('date') || '');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState(searchParams.get('time') || '');
  const [endTime, setEndTime] = useState('');
  const [budget, setBudget] = useState(searchParams.get('budget') || '');
  const [splitBudget, setSplitBudget] = useState<'yes' | 'no' | null>(null);

  // Add helper function to validate budget format
  const validateBudget = (value: string) => {
    if (!value) return true; // Empty budget is valid
    
    // Check if it's a range (contains a hyphen)
    if (value.includes('-')) {
      const [min, max] = value.split('-');
      const minNum = Number(min);
      const maxNum = Number(max);
      return !isNaN(minNum) && !isNaN(maxNum) && minNum >= 0 && maxNum > minNum;
    }
    
    // Single number validation
    return !isNaN(Number(value)) && Number(value) >= 0;
  };

  // Add helper function to check if budget has value
  const hasBudgetValue = (value: string) => {
    if (!value) return false;
    if (value.includes('-')) {
      const [min, max] = value.split('-');
      return Number(min) > 0 || Number(max) > 0;
    }
    return Number(value) > 0;
  };

  useEffect(() => {
    // Set split budget if budget is provided
    if (hasBudgetValue(budget)) {
      setSplitBudget('no');
    }
  }, []);

  const handleSubmit = () => {
    // Basic validation
    if (!eventName.trim() || !startDate || !groupId) return;
    if (endTime && !startTime) return; // Can't have end time without start time
    if (!validateBudget(budget)) return; // Validate budget format

    // Get group info
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const group = groups.find((g: any) => g.id === Number(groupId));
    
    if (!group) {
      console.error('Group not found');
      return;
    }

    const eventData = {
      id: Date.now().toString(),
      groupId: groupId.toString(),
      groupName: group.name,
      name: eventName,
      description,
      location,
      date: startDate,
      time: startTime || '',
      budget: budget || '',
      splitBudget: hasBudgetValue(budget) ? splitBudget === 'yes' : false,
      createdAt: new Date().toISOString()
    };

    // Add event using EventService
    EventService.addEvent(eventData);

    // Update the group with the latest event
    GroupService.addEventToGroup(Number(groupId), {
      name: eventName,
      description,
      date: startDate,
      time: startTime || '',
      budget: budget || '',
      splitBudget: hasBudgetValue(budget) ? splitBudget === 'yes' : false,
      members: group.members
    });

    router.push(`/groupdetails/${groupId}`);
  };

  // Disable create button if required fields are missing or invalid combinations exist
  const isCreateDisabled = Boolean(
    !eventName.trim() || 
    !startDate || 
    (endTime && !startTime) || 
    (hasBudgetValue(budget) && splitBudget === null) ||  // Only require split budget choice if budget > 0
    !validateBudget(budget)  // Add budget format validation
  );

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
                            placeholder="Name your event*"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                            required
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
                            type="text"
                            placeholder="Set budget (optional) - Use single number or range (e.g., 100 or 100-200)"
                            value={budget}
                            onChange={(e) => {
                                setBudget(e.target.value);
                                if (!hasBudgetValue(e.target.value)) {
                                    setSplitBudget(null);
                                }
                            }}
                            className={`w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460] ${!validateBudget(budget) && budget ? 'border-red-500' : ''}`}
                        />
                        {!validateBudget(budget) && budget && (
                            <p className="text-red-500 text-sm mt-1">
                                Please enter a valid budget (single number or range like 100-200)
                            </p>
                        )}

                        {/* Only show split budget options when budget has a value */}
                        {hasBudgetValue(budget) && (
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