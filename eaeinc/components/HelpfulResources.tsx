"use client";

import React from "react";
import { BookOpen, Globe, FileText, ExternalLink } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const resources: Resource[] = [
  {
    title: "Merrimack Library",
    description: "Find academic papers, books, and databases.",
    icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    link: "https://www.merrimack.edu/library/",
  },
  {
    title: "Community Research Portal",
    description: "Access ongoing research projects and publications.",
    icon: <Globe className="w-5 h-5 text-green-600" />,
    link: "https://www.merrimack.edu/academics/community-research/",
  },
  {
    title: "APA Style Guide",
    description: "Formatting and citation help for your papers.",
    icon: <FileText className="w-5 h-5 text-yellow-600" />,
    link: "https://apastyle.apa.org/",
  },
];

export default function HelpfulResources() {
  return (
    <aside className="bg-white rounded-lg shadow-md border p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
        Helpful Resources
      </h2>

      {resources.map((resource) => (
        <a
          key={resource.title}
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="mt-1">{resource.icon}</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-700 flex items-center justify-between">
              {resource.title}
              <ExternalLink className="w-4 h-4 ml-1 text-gray-400" />
            </p>
            <p className="text-sm text-gray-500">{resource.description}</p>
          </div>
        </a>
      ))}
    </aside>
  );
}
