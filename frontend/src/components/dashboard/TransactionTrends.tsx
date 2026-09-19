"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TransactionTrends({ data }: { data: any[] | undefined }) {
  if (!data) return (
    <div className="mt-8 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Transaction Trends</h3>
      <div className="grids-card p-4 h-[350px] animate-pulse flex flex-col justify-center items-center">
        <div className="w-full h-full border-b border-l border-white/5 flex items-end gap-2 px-4 pb-4">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="flex-1 bg-white/5 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 80)}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Transaction Trends</h3>
      <div className="grids-card p-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="transactions" 
              name="Total Transactions"
              stroke="var(--foreground)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="fraud" 
              name="Fraud Detected"
              stroke="var(--status-red)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
