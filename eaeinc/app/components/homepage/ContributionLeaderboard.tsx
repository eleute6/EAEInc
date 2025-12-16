"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/app/serverfuns";

interface Leader {
  userName: string;
  emailID: string;
  pictureURL: string;
  currentContributionScore: number;
}

function ContributionLeaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    const loadLeaders = async () => {
      const data = await fetchLeaderboard(3);
      setLeaders(data);
    };
    loadLeaders();
  }, []);

  return (
    <div className="flex flex-col bg-white mr-6 rounded-lg border border-[#003768]/20 py-4 px-6 space-y-4 shadow-md">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Contribution Leaderboard
      </h2>

      <ul className="w-full space-y-3">
        {leaders.map((leader, index) => (
          <li
            key={leader.emailID}
            className="flex items-center justify-between w-full border-b last:border-none pb-2"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                {leader.pictureURL ? (
                  <AvatarImage src={leader.pictureURL} />
                ) : (
                  <AvatarFallback className="bg-[#003768] text-white font-bold">
                    {leader.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium text-[#003768]">
                {index + 1}. {leader.userName}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {leader.currentContributionScore}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributionLeaderboard;
