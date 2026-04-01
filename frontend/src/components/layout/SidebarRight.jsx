'use client'
import React from 'react';
import { SleekCard, SleekButton } from '../ui/SleekElements';

const Tag = ({ name, count }) => (
  <div className="flex items-center justify-between group cursor-pointer py-3 hover:bg-gray-50 px-3 transition-all rounded-xl border border-transparent hover:border-gray-100">
    <div className="flex flex-col">
      <span className="font-bold text-sm text-gray-800 group-hover:text-primary transition-colors">#{name}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{count} discussions</span>
    </div>
    <span className="text-gray-300 group-hover:text-primary transition-colors">→</span>
  </div>
);

const UserToFollow = ({ name, handle }) => (
  <div className="flex items-center justify-between py-3 group">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm border border-secondary/5">
        {name[0]}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate leading-tight group-hover:text-primary transition-colors">{name}</p>
        <p className="text-xs text-gray-400 font-medium truncate">@{handle}</p>
      </div>
    </div>
    <SleekButton variant="outline" className="!px-3 !py-1.5 !text-[10px] !rounded-full !font-black uppercase tracking-wider h-fit border-gray-200">
      Follow
    </SleekButton>
  </div>
);

export default function SidebarRight() {
  return (
    <div className="space-y-6">
      <SleekCard className="!p-4">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Trending Now</h3>
          <button className="text-[10px] font-bold text-primary hover:underline">See all</button>
        </div>
        <div className="space-y-1">
          <Tag name="javascript" count="1.2k" />
          <Tag name="sync_network" count="942" />
          <Tag name="minimalism" count="450" />
          <Tag name="backend_arch" count="2.1k" />
        </div>
      </SleekCard>

      <SleekCard className="!p-4">
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Connect</h3>
        </div>
        <div className="flex flex-col divide-y divide-gray-50">
          <UserToFollow name="Sarah Chen" handle="schen_dev" />
          <UserToFollow name="Marcus Aurelius" handle="stoic_coder" />
          <UserToFollow name="Sync Official" handle="sync_team" />
        </div>
        <SleekButton variant="ghost" className="w-full mt-4 !text-[11px] !font-bold text-primary uppercase tracking-widest">
          View Suggestions
        </SleekButton>
      </SleekCard>
    </div>
  );
}
