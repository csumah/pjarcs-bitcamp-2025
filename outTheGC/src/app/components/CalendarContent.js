"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, LogOut } from 'lucide-react'; // Only import icons used in this component

// --- Configuration Constants ---
// IMPORTANT: Make sure these are your actual credentials
const GOOGLE_API_KEY = 'AIzaSyAmZZkSxo6gLWnMI7IlwVWBov7KaR_H8Ik'; // Replace if you haven't already
const GOOGLE_CLIENT_ID = '118688014672-tgnpascibcoo1bgt63l8fhro7nbepmsp.apps.googleusercontent.com'; // Replace if you haven't already
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

const CalendarComponentWithAuth = () => {
  // State variables
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  // Add state for events later: const [events, setEvents] = useState([]);

  // --- Callback Functions ---

  // Updates the sign-in state
  const updateSigninStatus = useCallback((signedIn) => {
    setIsSignedIn(signedIn);
    setError(null);
    if (signedIn) {
      // TODO: Fetch calendar events when signed in
      console.log("User is signed in. Ready to fetch events.");
      // fetchEvents(); // Example function call
    } else {
       // Clear events if needed when signed out
       // setEvents([]);
    }
  }, []); // Empty dependency array, relies on GAPI instance state

  // Initializes the GAPI client
  const initializeGapiClient = useCallback(async () => {
    // Defensive check if gapi is available
    if (!window.gapi) {
        console.error("window.gapi is not available. Script might not have loaded.");
        setError("Google API script failed to load.");
        setGapiLoaded(true); // Mark as 'loaded' to show error
        return;
    }

    try {
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: [DISCOVERY_DOC],
      });
      console.log('GAPI client initialized.');
      setGapiLoaded(true);

      // Listen for sign-in state changes
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Set the initial sign-in state
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());

    } catch (err) {
      console.error('Error initializing GAPI client:', err);
      setError(`Error initializing Google Client: ${err.message || JSON.stringify(err)}`);
      setGapiLoaded(true); // Mark as loaded to show error
    }
  }, [updateSigninStatus]);

  // Loads the GAPI script
  const loadGapiScript = useCallback(() => {
    if (document.getElementById('google-api-script')) {
      console.log('GAPI script potentially already loaded.');
       // Ensure initialization happens if script exists but gapi isn't ready
      if (window.gapi && !gapiLoaded) {
         window.gapi.load('client:auth2', initializeGapiClient);
      } else if (window.gapi && gapiLoaded) {
          // Already loaded and initialized (or tried to init)
          console.log('GAPI already loaded and init attempted.');
      }
      return;
    }

    console.log('Loading GAPI script...');
    const script = document.createElement('script');
    script.id = 'google-api-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('GAPI script loaded via onload.');
      // Load the client and auth2 libraries, then initialize
      window.gapi.load('client:auth2', initializeGapiClient);
    };
    script.onerror = () => {
        console.error('Failed to load GAPI script.');
        setError('Failed to load the Google API script. Check network/ad blocker.');
        setGapiLoaded(true);
    }
    document.body.appendChild(script);
  }, [initializeGapiClient, gapiLoaded]);

  // --- Effects ---

  // Load the GAPI script on component mount
  useEffect(() => {
    // Basic check for actual credentials
    if (GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY' || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        setError("API Key or Client ID is not set. Please update the code.");
        setGapiLoaded(true);
        return;
    }
    loadGapiScript();
    // Note: No cleanup needed for this script loading pattern
  }, [loadGapiScript]);

  // --- Event Handlers ---
  const handleSignInClick = () => {
    if (!window.gapi || !window.gapi.auth2 || !gapiLoaded) {
      console.error('GAPI auth2 instance not available or not loaded.');
      setError('Google API not ready. Please wait or refresh.');
      return;
    }
    window.gapi.auth2.getAuthInstance().signIn().catch((err) => {
      console.error('Error signing in:', err);
      setError(`Sign-in failed: ${err.details || err.error || 'Popup closed or error occurred.'}`);
    });
  };

  const handleSignOutClick = () => {
     if (!window.gapi || !window.gapi.auth2 || !gapiLoaded) {
      console.error('GAPI auth2 instance not available or not loaded.');
      return;
    }
    window.gapi.auth2.getAuthInstance().signOut().catch((err) => {
      console.error('Error signing out:', err);
      setError(`Sign-out failed: ${err.details || err.error}`);
    });
  };

  // --- Render Logic ---
  return (
    // Main Content Area Container (assumes parent is flex)
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
        {/* Header Area */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-800">
            Shared Google Calendar
          </h2>
          {/* Auth Button Area */}
          <div>
            {!gapiLoaded && !error && <span className="text-sm text-gray-500">Initializing...</span>}
            {gapiLoaded && !error && (
              isSignedIn ? (
                <button onClick={handleSignOutClick} className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <button onClick={handleSignInClick} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <LogIn size={16} /> Connect Google Calendar
                </button>
              )
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 text-sm flex-shrink-0">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Calendar Placeholder Area */}
        <div className="flex-grow flex items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg min-h-[400px]">
          {gapiLoaded && isSignedIn ? (
            <div>
              [ Google Calendar View Placeholder ]
              <br />
              Authentication successful. Ready to fetch events.
            </div>
          ) : gapiLoaded && !isSignedIn && !error ? (
            'Please connect your Google Calendar to view events.'
          ) : !gapiLoaded && !error ? (
            'Loading Google API...'
          ) : (
            'Cannot display calendar due to error.'
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponentWithAuth; // Export the component

