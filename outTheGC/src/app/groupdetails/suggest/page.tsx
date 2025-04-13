'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Logo, { poppins } from '@/app/components/Logo';
import { GoogleGenAI } from "@google/genai";

interface EventSuggestion {
  name: string;
  description: string;
  location: string;
  suggestedDate: string;
  suggestedTime: string;
  estimatedBudget: string;
}

export default function SuggestEvents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  
  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');
  const [preferredDays, setPreferredDays] = useState('');
  const [preferredTimes, setPreferredTimes] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>([]);
  const [showForm, setShowForm] = useState(true);

  const handleUseSuggestion = (suggestion: EventSuggestion) => {
    if (!groupId) return;

    // Navigate to event creation with pre-filled data
    router.push(`/groups/create/event?groupId=${groupId}&` + 
      `name=${encodeURIComponent(suggestion.name)}&` +
      `description=${encodeURIComponent(suggestion.description)}&` +
      `location=${encodeURIComponent(suggestion.location)}&` +
      `date=${encodeURIComponent(suggestion.suggestedDate)}&` +
      `time=${encodeURIComponent(suggestion.suggestedTime)}&` +
      `budget=${encodeURIComponent(suggestion.estimatedBudget.replace(/[^0-9.]/g, ''))}`
    );
  };

  const handleGetSuggestions = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    if (!location.trim()) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

      // Get current date for context
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];

      const prompt = `Generate 4 event suggestions for a group activity with the following preferences:
      Location: ${location}
      Current Date: ${dateString} (all suggested dates must be after this date)
      ${activities ? `Preferred Activities: ${activities}` : ''}
      ${preferredDays ? `Preferred Days: ${preferredDays}` : 'Preferred Days: Any day after the current date'}
      ${preferredTimes ? `Preferred Times: ${preferredTimes}` : ''}
      ${additionalDetails ? `Additional Details: ${additionalDetails}` : ''}
      
      Important Requirements:
      - All suggested dates must be after ${dateString}
      - Dates should be in YYYY-MM-DD format
      - If no preferred days are specified, suggest dates within the next 2 weeks
      
      Format each suggestion as a JSON object with these fields:
      {
        "name": "Event name",
        "description": "Brief description",
        "location": "Specific location",
        "suggestedDate": "Suggested date (YYYY-MM-DD format)",
        "suggestedTime": "Suggested time",
        "estimatedBudget": "Estimated cost per person"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const responseText = response.text?.replace(/```json\n?|\n?```/g, '') || '[]';
      const suggestedEvents: EventSuggestion[] = JSON.parse(responseText);
      setSuggestions(suggestedEvents);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`ml-[125px] text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
            Get Event Suggestions
          </h1>
          <Logo />
        </div>

        {!showForm && suggestions.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[20px] p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className={`${poppins.className} text-xl font-semibold text-[#F4A460] mb-2`}>
                    {suggestion.name}
                  </h3>
                  <p className={`${poppins.className} text-[#333333]/70 mb-4`}>
                    {suggestion.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                      <p className="text-sm text-[#333333]/70">Location</p>
                      <p className="font-medium">{suggestion.location}</p>
                    </div>
                    <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                      <p className="text-sm text-[#333333]/70">Estimated Budget</p>
                      <p className="font-medium">{suggestion.estimatedBudget}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                      <p className="text-sm text-[#333333]/70">Suggested Date</p>
                      <p className="font-medium">{suggestion.suggestedDate}</p>
                    </div>
                    <div className="bg-[#FFF5EE] rounded-[15px] p-3">
                      <p className="text-sm text-[#333333]/70">Suggested Time</p>
                      <p className="font-medium">{suggestion.suggestedTime}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseSuggestion(suggestion)}
                    className="w-full py-3 bg-[#F4A460] text-white rounded-full hover:bg-[#E38B4F] transition-colors font-semibold"
                  >
                    Use This Suggestion
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setSuggestions([]);
                }}
                className="px-6 py-2 bg-[#F4A460] text-white rounded-full hover:bg-[#E38B4F] transition-colors font-semibold"
              >
                Generate New Suggestions
              </button>
              <button
                onClick={() => router.push(`/groupdetails/${groupId}`)}
                className="px-6 py-2 border-2 border-[#F4A460] text-[#F4A460] rounded-full hover:bg-[#F4A460] hover:text-white transition-colors font-semibold"
              >
                Back to Group
              </button>
            </div>
          </>
        )}

        {/* Input Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Location */}
              <div>
                <input
                  type="text"
                  placeholder="Enter location*"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                  required
                />
              </div>

              {/* Activities */}
              <div>
                <input
                  type="text"
                  placeholder="Preferred activities (optional)"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                />
              </div>

              {/* Preferred Days */}
              <div>
                <input
                  type="text"
                  placeholder="Preferred days (optional, e.g., weekends, Monday-Friday)"
                  value={preferredDays}
                  onChange={(e) => setPreferredDays(e.target.value)}
                  className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                />
              </div>

              {/* Preferred Times */}
              <div>
                <input
                  type="text"
                  placeholder="Preferred times (optional, e.g., morning, evening)"
                  value={preferredTimes}
                  onChange={(e) => setPreferredTimes(e.target.value)}
                  className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460]"
                />
              </div>

              {/* Additional Details */}
              <div>
                <textarea
                  placeholder="Additional details or preferences (optional)"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full p-4 text-lg border-b border-[#F4A460]/30 bg-transparent placeholder-[#999] text-black focus:outline-none focus:border-[#F4A460] resize-none h-32"
                />
              </div>

              {/* Get Suggestions Button */}
              <button
                onClick={handleGetSuggestions}
                disabled={!location.trim() || isLoading}
                className={`w-full py-4 text-lg rounded-full font-semibold transition-all duration-200 shadow-md
                  ${!location.trim() || isLoading
                    ? 'bg-[#999] cursor-not-allowed opacity-50' 
                    : 'bg-[#F4A460] hover:bg-[#E38B4F] text-white'
                  }`}
              >
                {isLoading ? 'Generating Suggestions...' : 'Get Suggestions'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


