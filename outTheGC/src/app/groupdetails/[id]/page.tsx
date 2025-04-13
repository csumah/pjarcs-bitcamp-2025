"use client"

import { FC, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Logo, { poppins } from '../../components/Logo';
import GroupService, { Group } from '../../services/groupService';
import EventService from '../../services/eventService';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { FaLightbulb, FaTrash } from 'react-icons/fa';

interface Event {
  id: string;
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
  const router = useRouter();
  const groupId = Number(params.id);
  const [group, setGroup] = useState<Group | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Clean up any orphaned events
    EventService.cleanupDeletedGroups();
    
    // Load group data using the service
    const currentGroup = GroupService.getGroupById(groupId);
    setGroup(currentGroup);

    // Load all events for this group
    const groupEvents = EventService.getEventsByGroupId(String(groupId));
    setEvents(groupEvents);

    // Update group with latest event if exists
    if (groupEvents.length > 0) {
      const latestEvent = groupEvents[0];
      const groupWithEvent = GroupService.addEventToGroup(groupId, {
        name: latestEvent.name,
        description: latestEvent.description,
        date: latestEvent.date,
        time: latestEvent.time,
        budget: latestEvent.budget,
        splitBudget: latestEvent.splitBudget,
        members: group?.members || []
      });
      if (groupWithEvent) {
        setGroup(groupWithEvent);
      }
    }
  }, [groupId]);

  const handleGetSuggestions = () => {
    router.push(`/groupdetails/suggest?groupId=${groupId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Delete the event
    EventService.deleteEvent(eventId);
    
    // Update the events list
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);

    // If this was the latest event, update the group's event data
    if (events[0]?.id === eventId) {
      if (updatedEvents.length > 0) {
        // Set the next event as the group's current event
        const nextEvent = updatedEvents[0];
        GroupService.addEventToGroup(groupId, {
          name: nextEvent.name,
          description: nextEvent.description,
          date: nextEvent.date,
          time: nextEvent.time,
          budget: nextEvent.budget,
          splitBudget: nextEvent.splitBudget,
          members: group?.members || []
        });
      } else {
        // No more events, remove the event from group
        GroupService.updateGroup(groupId, { event: undefined });
      }
    }
  };

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
              <div className="flex items-center justify-between p-6">
                <h2
                  className="text-white font-inter font-bold"
                  style={{
                    fontWeight: 700,
                    fontSize: '32px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}
                >
                  Upcoming Plans
                </h2>

                {/* Create New Event Button - Moved to top */}
                <Link 
                  href={`/groups/create/event?groupId=${group.id}`}
                  className="flex items-center px-6 py-2 bg-white/90 rounded-full hover:bg-white transition-colors no-underline text-inherit"
                >
                  <HiPlus className="h-5 w-5 text-[#F4A460]" />
                  <span className="ml-2 text-[#F4A460] font-medium">Create Event</span>
                </Link>
              </div>

              {/* Event List */}
              <div 
                className="flex flex-col items-center space-y-4 overflow-y-auto px-6 pb-6" 
                style={{ 
                  height: 'calc(100% - 80px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#F7AE5A transparent'
                }}
              >
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <div
                      key={event.id}
                      className="bg-white/90 rounded-[20px] p-6 w-full shadow-sm"
                    >
                      <div className="flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-2xl font-semibold ${poppins.className} text-[#F4A460]`}>
                              {event.name}
                            </h3>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this event?')) {
                                  handleDeleteEvent(event.id);
                                }
                              }}
                              className="p-2 text-[#F4A460] hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                              title="Delete event"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="bg-[#FFF5EE] rounded-[15px] p-4 mb-3">
                            <p className={`text-base text-[#333333]/80 ${poppins.className}`}>
                              {event.description}
                            </p>
                          </div>
                          <div className={`grid grid-cols-2 gap-4 ${poppins.className}`}>
                            <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                              <p className="text-sm text-[#333333]/70">Date & Time</p>
                              <p className="font-medium">{event.date}</p>
                              <p className="font-medium">{event.time}</p>
                            </div>
                            <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                              <p className="text-sm text-[#333333]/70">Budget</p>
                              <p className="font-medium">${event.budget}</p>
                              <p className="text-sm text-[#F4A460]">
                                {event.splitBudget ? 'Split between members' : 'No split'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#F4A460]/20">
                          <div className="flex items-center">
                            <span className={`${poppins.className} ml-3 text-[#333333]/70 text-sm`}>
                              {group.members.length || 0} members attending
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-white/90">
                    <p className={`${poppins.className} text-lg mb-2`}>No events planned yet</p>
                    <p className={`${poppins.className} text-sm`}>Create your first event!</p>
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

            {/* Replace Finance Box with Get Suggestions Box */}
            <div
              className="rounded-[20px] h-[400px] relative overflow-hidden"
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
                Get Suggestions
              </h2>

              <div className="flex flex-col items-center justify-center h-[calc(100%-80px)]">
                <div 
                  className="bg-white/90 rounded-[20px] p-6 w-[80%] text-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={handleGetSuggestions}
                >
                  <FaLightbulb className="text-[#F4A460] text-4xl mx-auto mb-4" />
                  <h3 className={`${poppins.className} text-xl font-semibold text-[#F4A460] mb-2`}>
                    Need Ideas?
                  </h3>
                  <p className={`${poppins.className} text-[#333333]/70`}>
                    Get AI-powered event suggestions tailored for your group
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className={`${poppins.className} text-white/90 text-sm`}>
                    Discover exciting activities and events that your group will love
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage; 