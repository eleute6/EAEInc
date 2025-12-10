import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon, HomeIcon, SearchIcon, UploadIcon } from "lucide-react";

interface HeaderProps {
  user?: { name: string; email: string; picture: string } | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full fixed top-0 left-0 bg-white border-b border-gray-300 z-50 shadow-md">
      <div className="flex items-center p-4 max-w-[1280px] mx-auto">
        {/* Logo */}
        <Image src="/logo.jpg" alt="Logo" width={100} height={100} />

        {/* Search Bar */}
        <div className="flex-1 mx-4">
          <form className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md w-full">
            <SearchIcon className="h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 outline-none"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <Link href="/">
            <div className="flex flex-col items-center cursor-pointer">
              <HomeIcon className="h-5 w-5" />
              <span className="text-sm mt-1">Home</span>
            </div>
          </Link>

          <Link href="/consortium">
            <div className="flex flex-col items-center cursor-pointer">
              <BookOpenIcon className="h-5 w-5" />
              <span className="text-sm mt-1">Consortium</span>
            </div>
          </Link>

          <Link href="/uploads">
            <div className="flex flex-col items-center cursor-pointer">
              <UploadIcon className="h-5 w-5" />
              <span className="text-sm mt-1">Upload</span>
            </div>
          </Link>

          {/* User Info */}
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
    </header>
  );
}
