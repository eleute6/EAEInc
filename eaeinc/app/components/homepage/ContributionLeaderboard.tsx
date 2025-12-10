"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";

function ContributionLeaderboard() {
  // Dummy leaderboard data
  const leaders = [
    { name: "Alice Brown", contributions: 42, imageUrl: "" },
    { name: "John Smith", contributions: 36, imageUrl: "" },
    { name: "Mia Johnson", contributions: 28, imageUrl: "" },
  ];

  return (
    <div className="flex flex-col bg-white mr-6 rounded-lg border border-[#003768]/20 py-4 px-6 space-y-4 shadow-md">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Contribution Leaderboard
      </h2>

      <ul className="w-full space-y-3">
        {leaders.map((leader, index) => (
          <li
            key={index}
            className="flex items-center justify-between w-full border-b last:border-none pb-2"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                {leader.imageUrl ? (
                  <AvatarImage src={leader.imageUrl} />
                ) : (
                  <AvatarFallback className="bg-[#003768] text-white font-bold">
                    {leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>

              <span className="font-medium text-[#003768]">{leader.name}</span>
            </div>

            <span className="text-sm font-semibold text-gray-600">
              {leader.contributions}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributionLeaderboard;
