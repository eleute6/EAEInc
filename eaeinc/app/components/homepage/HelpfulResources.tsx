"use client";

import React from "react";
import {
  BookOpen,
  Shield,
  FileText,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

interface Resource {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const resources: Resource[] = [
  {
    title: "New To Merrimack/Getting Started",
    description: "Orientation, onboarding, and guidance for new researchers.",
    icon: <BookOpen className="w-5 h-5 text-[#003768]" />, // Navy
    link: "https://www.merrimack.edu/research/office-of-research-and-sponsored-programs/new-to-merrimack/",
  },
  {
    title: "Research Compliance",
    description:
      "IRB: institutional review board, biosafety, policies and procedures.",
    icon: <Shield className="w-5 h-5 text-[#FDB813]" />, // Gold
    link: "https://www.merrimack.edu/research/office-of-research-and-sponsored-programs/irb/",
  },
  {
    title: "Proposal Development & Submission",
    description:
      "Guidance for preparing, writing, and submitting research proposals.",
    icon: <FileText className="w-5 h-5 text-[#003768]" />, // Navy
    link: "https://www.merrimack.edu/research/office-of-research-and-sponsored-programs/proposal/",
  },
  {
    title: "OSRP Resources",
    description:
      "Forms, templates, and support materials for sponsored research.",
    icon: <FolderOpen className="w-5 h-5 text-[#FDB813]" />, // Gold
    link: "https://www.merrimack.edu/research/office-of-research-and-sponsored-programs/resources/",
  },
];

export default function HelpfulResources() {
  return (
    <aside className="bg-white rounded-lg shadow-md border border-[#003768]/20 p-4 space-y-4">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Helpful Resources
      </h2>
      {resources.map((resource) => (
        <a
          key={resource.title}
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-[#FDB813]/10 transition"
        >
          <div className="mt-1">{resource.icon}</div>
          <div className="flex-1">
            <p className="font-semibold text-[#003768] flex items-center justify-between">
              {resource.title}
              <ExternalLink className="w-4 h-4 ml-1 text-gray-400" />
            </p>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </div>
        </a>
      ))}
    </aside>
  );
}
