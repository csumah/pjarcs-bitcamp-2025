'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Logo, { poppins } from '../../components/Logo';
import GroupService from '../../services/groupService';

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [friendEmails, setFriendEmails] = useState(['', '', '']);

  const handleAddFriend = () => {
    setFriendEmails([...friendEmails, '']);
  };

  const handleFriendEmailChange = (index: number, value: string) => {
    const newEmails = [...friendEmails];
    newEmails[index] = value;
    setFriendEmails(newEmails);
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) return;

    const groupData = {
      name: groupName,
      description,
      members: friendEmails.filter(email => email.trim() !== ''),
    };

    // Create group using the service
    const newGroup = GroupService.createGroup(groupData);

    // Navigate to event creation page with the group ID
    router.push(`/groups/create/event?groupId=${newGroup.id}`);
  };

  const isNextDisabled = !groupName.trim();

  return (
    <div className="min-h-screen flex">
        {/* Left Sidebar - Orange */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 bg-[#F5F5F5]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className={`ml-[125px] top-[45px] text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                    Create Group
                </h1>

                <Logo />
            </div>

            {/* Form Container */}
            <div className="max-w-2xl mx-auto p-8">
                {/* Group Name */}
                <div className="mb-6">
                    <input
                    type="text"
                    placeholder="Name your friend group"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                    />
                </div>

                {/* Description */}
                <div className="mb-8">
                    <input
                    type="text"
                    placeholder="Add description... (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] focus:outline-none focus:border-[#F4A460]"
                    />
                </div>

                {/* Add Friends Section */}
                <div className="mb-8">
                    <h3 className={`text-[#F4A460] text-2xl font-semibold mb-2 ${poppins.className}`}>
                        Add Friends
                    </h3>
                    <p className="text-[#999] text-base mb-6">
                        Don't worry! You can always add more later.
                    </p>

                    <div className="space-y-4">
                        {friendEmails.map((email, index) => (
                            <div
                            key={index}
                            className="relative"
                            >
                                <input
                                    type="email"
                                    placeholder="Enter Friend's G-mail"
                                    value={email}
                                    onChange={(e) => handleFriendEmailChange(index, e.target.value)}
                                    className="w-full p-4 text-lg rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#F4A460]/20"
                                />
                                <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_2px_4px_rgba(0,0,0,0.05)]"></div>
                            </div>
                        ))}
                    </div>

                    <button
                    onClick={handleAddFriend}
                    className="text-[#999] text-base mt-4 hover:text-[#F4A460]"
                    >
                        + Add Row
                    </button>
                </div>  

                {/* Next Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isNextDisabled}
                    className={`w-full py-4 text-lg rounded-full font-semibold transition-all duration-200 shadow-md
                      ${isNextDisabled 
                        ? 'bg-[#999] cursor-not-allowed opacity-50' 
                        : 'bg-[#F4A460] hover:bg-[#E38B4F] text-white'
                      }`}
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );
} 