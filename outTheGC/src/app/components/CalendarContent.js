"use client";

import React, { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';

const GOOGLE_CLIENT_ID = '118688014672-tgnpascibcoo1bgt63l8fhro7nbepmsp.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const CalendarComponentWithAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

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

      // Initialize the token client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            fetchCalendarEvents(tokenResponse.access_token);
          }
        }
      });
      setTokenClient(client);

      // Initialize the Google Identity Services with minimal configuration
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      // Render the sign-in button with minimal configuration
      const buttonDiv = document.getElementById('googleSignInButton');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(
          buttonDiv,
          { theme: 'outline', size: 'large' }
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
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(`Error fetching calendar events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = async (response) => {
    if (response.credential) {
      setIsSignedIn(true);
      setError(null);
      if (tokenClient) {
        tokenClient.requestAccessToken();
      }
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

