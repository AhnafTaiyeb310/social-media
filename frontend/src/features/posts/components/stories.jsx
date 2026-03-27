"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_STORIES = [
  { id: 1, username: "Your Story", avatar: null, isUser: true },
  { id: 2, username: "sarah_j", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 3, username: "dev_kyle", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 4, username: "lina_art", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 5, username: "mike_codes", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 6, username: "anna_w", avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 7, username: "john_doe", avatar: "https://i.pravatar.cc/150?u=6" },
];

export function Stories() {
  return (
    <div className="mb-8 flex w-full items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {MOCK_STORIES.map((story) => (
        <motion.div
          key={story.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px]"
        >
          <div className={`relative p-1 rounded-full ${story.isUser ? 'bg-transparent' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
            <div className="rounded-full bg-white p-0.5 dark:bg-black">
              <Avatar className="h-14 w-14 border-2 border-transparent">
                <AvatarImage src={story.avatar} />
                <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold dark:bg-zinc-800">
                  {story.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {story.isUser && (
              <div className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1 text-white border-2 border-white dark:border-black shadow-sm">
                <Plus className="h-3 w-3" />
              </div>
            )}
          </div>
          <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 truncate w-16 text-center">
            {story.username}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
