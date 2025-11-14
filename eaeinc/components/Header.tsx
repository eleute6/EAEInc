import React from "react";
import Image from "next/image";
import Link from "next/link"; // correct Link
import { BookOpenIcon, HomeIcon, SearchIcon } from "lucide-react";

interface HeaderProps {
  user?: { name: string; email: string; picture: string } | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <div className="flex items-center p-2">
      <Image src="/logo.jpg" alt="Logo" width={100} height={100} />

      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>

      {/* Navigation links */}
      <div className="flex space-x-6 items-center">
        <Link href="/">
          <div className="flex flex-col items-center icon cursor-pointer">
            <HomeIcon className="h-5 w-5" />
            <span className="text-sm mt-1">Home</span>
          </div>
        </Link>

        <Link href="/research">
          <div className="flex flex-col items-center icon cursor-pointer">
            <BookOpenIcon className="h-5 w-5" />
            <span className="text-sm mt-1">Consortium</span>
          </div>
        </Link>

        {/* User info only if logged in */}
        {user && (
          <div className="ml-4 flex items-center space-x-2">
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
