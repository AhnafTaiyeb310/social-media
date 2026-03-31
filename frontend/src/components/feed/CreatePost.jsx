'use client'
import React from 'react';
import { SleekCard, SleekButton } from '../ui/SleekElements';

export default function CreatePost() {
  return (
    <SleekCard className="bg-white border-none shadow-sleek-md p-6 mb-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shrink-0 border border-gray-100">
          👤
        </div>
        <div className="flex-1 space-y-4">
          <textarea 
            placeholder="Share an insight or snippet..."
            className="w-full bg-transparent text-lg font-medium text-gray-700 focus:outline-none min-h-[90px] resize-none py-1 placeholder:text-gray-300"
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex gap-1">
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all">🖼️</button>
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all">📂</button>
              <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary transition-all">✨</button>
            </div>
            <SleekButton className="!py-2.5 !px-8 !text-xs !rounded-full shadow-lg shadow-primary/20">
              Publish to Sync
            </SleekButton>
          </div>
        </div>
      </div>
    </SleekCard>
  );
}
