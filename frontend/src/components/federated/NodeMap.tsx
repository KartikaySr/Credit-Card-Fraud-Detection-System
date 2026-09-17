'use client';
import React from 'react';

export default function NodeMap() {
  return (
    <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-2 z-10">
        Global Node Topology
      </h3>
      <p className="text-sm text-gray-400 mb-4 z-10">Real-time geographic distribution of active FL clients.</p>
      
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-cover opacity-20 grayscale"></div>
      
      <div className="relative flex-1 w-full h-full">
        {/* Simulated Nodes on a Map */}
        <div className="absolute top-[30%] left-[20%] w-3 h-3 rounded-full bg-blue-500 animate-ping"></div>
        <div className="absolute top-[30%] left-[20%] w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>
        
        <div className="absolute top-[25%] left-[45%] w-2 h-2 rounded-full bg-teal-500 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[25%] left-[45%] w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]"></div>

        <div className="absolute top-[40%] left-[70%] w-4 h-4 rounded-full bg-indigo-500 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[70%] w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_15px_#818cf8]"></div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity">
          <path d="M 20% 30% Q 30% 10% 45% 25%" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          <path d="M 45% 25% Q 60% 40% 70% 40%" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
        </svg>
      </div>
    </div>
  );
}
