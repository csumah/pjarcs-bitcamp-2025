"use client";

import React, { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';

//Might need to change this to the client ID for the production environment
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly';

const CalendarComponentWithAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  // LOOK HERE

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

  const fetchCalendarEvents = async (accessToken) => {
    try {
      setLoading(true);
      const now = new Date();
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(now.getDate() + 90);
      
      console.log('Fetching calendar events with scopes:', SCOPES);
      
      // First, test the token by getting calendar list
      const calendarResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!calendarResponse.ok) {
        const errorData = await calendarResponse.json();
        console.error('Calendar List Error:', errorData);
        throw new Error('Failed to access calendar list');
      }

      const calendarData = await calendarResponse.json();
      console.log('Available calendars:', calendarData);

      // Then fetch events
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
        const errorData = await response.json();
        console.error('Calendar Events Error:', errorData);
        throw new Error(`Failed to fetch calendar events: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Calendar events response:', data);

      if (!data.items || data.items.length === 0) {
        console.log('No events found in the response');
      } else {
        console.log('Found events:', data.items.map(event => ({
          summary: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date
        })));
      }

      setEvents(data.items || []);
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
    if (tokenClient) {
      window.google.accounts.oauth2.revoke(tokenClient.access_token, () => {
        console.log('Access token revoked');
      });
    }
  };

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

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50">
      <div className="bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] rounded-xl shadow-lg p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold text-white">
            Shared Google Calendar
          </h2>
          <div>
            {!isSignedIn ? (
              <div id="googleSignInButton"></div>
            ) : (
              <button 
                onClick={handleSignOut} 
                className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 text-sm flex-shrink-0">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex-grow flex flex-col items-center justify-center text-center text-white border-2 border-dashed border-white rounded-lg min-h-[400px] p-4">
          {loading ? (
            <div className="text-white">Loading calendar events...</div>
          ) : isSignedIn ? (
            events.length > 0 ? (
              <div className="w-full max-w-4xl">
                <h3 className="text-xl font-semibold mb-4 text-white">Upcoming Events</h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gray-50 p-4 rounded-lg text-left">
                      <div className="font-medium text-gray-800">{event.summary}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(event.start.dateTime || event.start.date)}
                      </div>
                      {event.description && (
                        <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>No upcoming events found.</div>
            )
          ) : (
            'Please connect your Google Calendar to view events.'
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponentWithAuth;

