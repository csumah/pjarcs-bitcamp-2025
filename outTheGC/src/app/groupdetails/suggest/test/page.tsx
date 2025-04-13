'use client';

import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDk6Sdx3culfPCOBtDolEF_bZ7OQizxgWc" });

export default function TestPage() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Explain how AI works in a few words",
      });
      setResponse(result.text || 'No response text available');
    } catch (error) {
      setResponse('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Test Gemini'}
      </button>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {response}
        </div>
      )}
    </div>
  );
}