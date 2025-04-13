'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function CreateEvent() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [budget, setBudget] = useState('');
  const [splitBudget, setSplitBudget] = useState<'yes' | 'no' | null>(null);

  const handleSubmit = () => {
    if (!eventName.trim() || !date || !time) return;

    // Get the most recently created group
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const currentGroup = groups[groups.length - 1];

    // Add event details to the group
    const updatedGroup = {
      ...currentGroup,
      event: {
        name: eventName,
        description,
        date,
        time,
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

  const isCreateDisabled = !eventName.trim() || !date || !time;

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

                <div className="top-[45px] flex items-center">
                    <Image
                    src="/component/logo.png"
                    alt="OutTheGC Logo"
                    width={140}
                    height={140}
                    className="w-50 h-50"
                    />
                    <div className="flex flex-col mr-4">
                        <h1 className={`text-5xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                            OutTheGC 
                        </h1>
                        <p className={`${poppins.className} text-[#F4A460] mt-2 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                            making moves, for real.
                        </p>
                    </div>
                </div>
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
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add description... (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                        />
                    </div>

                    {/* Date & Time Section */}
                    <div className="space-y-6">
                        <h3 className={`text-[#F4A460] text-xl font-semibold ${poppins.className}`}>
                            Date & Time
                        </h3>
                    
                        <input
                            type="date"
                            placeholder="Set date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                        />
                    
                        <input
                            type="time"
                            placeholder="Set time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                        />
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
                            className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                        />

                        <div className="space-y-2">
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