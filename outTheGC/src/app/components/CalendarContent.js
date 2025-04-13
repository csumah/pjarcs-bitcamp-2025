"use client";

import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

//Might need to change this to the client ID for the production environment
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly';

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

// Component for displaying calendar events
export const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState({});

  useEffect(() => {
    const savedCalendarData = localStorage.getItem('googleCalendarData');
    if (savedCalendarData) {
      const { events: savedEvents, lastUpdated } = JSON.parse(savedCalendarData);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (new Date(lastUpdated) > oneHourAgo) {
        setEvents(savedEvents);
        organizeEventsByDate(savedEvents);
      } else {
        localStorage.removeItem('googleCalendarData');
      }
    }
  }, []);

  const organizeEventsByDate = (events) => {
    const organizedEvents = {};
    events.forEach(event => {
      const date = new Date(event.start.dateTime || event.start.date);
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
    let dayCounter = 1;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${month}-${i}`;
      const dayEvents = monthEvents[dateKey] || [];
      
      daysArray.push(
        <div key={i} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">{i}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.map((event, index) => (
              <div 
                key={`${i}-${index}`}
                className="text-xs bg-blue-50 text-blue-700 rounded px-1 truncate"
                title={event.summary}
              >
                {event.summary}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
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
    <div className="flex-1 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="text-white text-center py-4">Loading calendar events...</div>
          ) : events.length > 0 ? (
            renderCalendar()
          ) : (
            <div className="text-white text-center py-4">No upcoming events found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for authentication and full calendar functionality
const CalendarComponentWithAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthEvents, setMonthEvents] = useState({});

  // Load group events on component mount
  useEffect(() => {
    loadGroupEvents();
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadGroupEvents = () => {
    try {
      // Get all groups from localStorage
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const allGroupEvents = [];

      // Extract events from each group
      groups.forEach(group => {
        if (group.events) {
          const formattedEvents = group.events.map(event => ({
            id: `group-${group.id}-${Date.now()}`,
            summary: event.name,
            description: event.description,
            start: {
              dateTime: event.time ? `${event.date}T${event.time}` : undefined,
              date: !event.time ? event.date : undefined
            },
            end: {
              dateTime: event.time ? `${event.date}T${event.time}` : undefined,
              date: !event.time ? event.date : undefined
            },
            source: 'group',
            groupName: group.name
          }));
          allGroupEvents.push(...formattedEvents);
        }
      });

      setGroupEvents(allGroupEvents);
      if (!isSignedIn) {
        setEvents(allGroupEvents);
        organizeEventsByDate(allGroupEvents);
      }
    } catch (error) {
      console.error('Error loading group events:', error);
    }
  };

  const organizeEventsByDate = (eventsToOrganize) => {
    const organizedEvents = {};
    eventsToOrganize.forEach(event => {
      const date = new Date(event.start.dateTime || event.start.date);
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
      daysArray.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${month}-${i}`;
      const dayEvents = monthEvents[dateKey] || [];
      
      daysArray.push(
        <div key={i} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">{i}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.map((event, index) => (
              <div 
                key={`${i}-${index}`}
                className={`text-xs rounded px-1 truncate ${
                  event.source === 'group' 
                    ? 'bg-[#FFF5EE] text-[#F4A460]' 
                    : 'bg-blue-50 text-blue-700'
                }`}
                title={`${event.summary}${event.groupName ? ` (${event.groupName})` : ''}`}
              >
                {event.summary}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
            {daysArray}
          </div>
        </div>
      </div>
    );
  };

  const fetchCalendarEvents = async (accessToken) => {
    try {
      setLoading(true);
      const now = new Date();
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(now.getDate() + 90);
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` + 
        new URLSearchParams({
          timeMin: now.toISOString(),
          timeMax: ninetyDaysFromNow.toISOString(),
          orderBy: 'startTime',
          singleEvents: true,
          maxResults: 100,
          fields: 'items(id,summary,description,start,end)'
        }),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      const calendarEvents = data.items || [];
      
      // Merge Google Calendar events with group events
      const mergedEvents = [...calendarEvents, ...groupEvents];
      setEvents(mergedEvents);
      organizeEventsByDate(mergedEvents);
      saveCalendarData(calendarEvents); // Save only Google Calendar events
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(`Error fetching calendar events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = async (response, client) => {
    try {
      console.log('Credential response received, requesting token...');
      if (response.credential) {
        // Use the passed client instead of relying on state
        if (client) {
          client.requestAccessToken({ prompt: 'consent' });
        } else {
          console.error('Token client not provided to handler');
          setError('Authentication system not properly initialized');
        }
      } else {
        console.error('No credential in response:', response);
        setError('Authentication failed: No credential received');
      }
    } catch (err) {
      console.error('Error in credential response:', err);
      setError(`Authentication error: ${err.message}`);
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setEvents([]);
    localStorage.removeItem('googleCalendarData');
    if (tokenClient) {
      window.google.accounts.oauth2.revoke(tokenClient.access_token, () => {
        console.log('Access token revoked');
      });
    }
  };

  const saveCalendarData = (calendarEvents) => {
    const calendarData = {
      events: calendarEvents,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('googleCalendarData', JSON.stringify(calendarData));
  };

  const initializeGoogleAuth = () => {
    try {
      if (!window.google) {
        throw new Error('Google API not loaded');
      }

      console.log('Initializing Google Auth...');

      // Initialize the token client first
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log('Token response received:', tokenResponse ? 'success' : 'failed');
          if (tokenResponse && tokenResponse.access_token) {
            setIsSignedIn(true);
            fetchCalendarEvents(tokenResponse.access_token);
          } else {
            console.error('No access token received');
            setError('Failed to get access token');
          }
        }
      });

      // Set the token client in state immediately
      setTokenClient(client);
      console.log('Token client initialized:', !!client);

      // Initialize the Google Identity Services
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          // Ensure tokenClient is available before proceeding
          if (!client) {
            console.error('Token client not available');
            setError('Authentication system not properly initialized');
            return;
          }
          handleCredentialResponse(response, client);
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Render the sign-in button
      const buttonDiv = document.getElementById('googleSignInButton');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(
          buttonDiv,
          { 
            theme: 'outline', 
            size: 'large',
            width: 250,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            type: 'standard'
          }
        );
      }
    } catch (err) {
      console.error('Error initializing Google Auth:', err);
      setError(`Error initializing Google Auth: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#F4A460]">
            {isSignedIn ? 'Shared Calendar' : 'Group Events Calendar'}
          </h2>
          <div>
            {!isSignedIn ? (
              <div id="googleSignInButton"></div>
            ) : (
              <button 
                onClick={handleSignOut} 
                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-2 rounded-lg mb-4 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="text-white text-center py-4">Loading calendar events...</div>
          ) : (
            renderCalendar()
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponentWithAuth;
