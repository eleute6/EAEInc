"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Home, Search, Upload, Shield } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    picture: string /* isAdmin?: boolean */;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full fixed top-0 left-0 bg-[#002855] text-white z-50 shadow-md">
      <div className="flex items-center p-4 max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/merrimack-logo.png" // replace with official logo asset
            alt="Merrimack College Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-6">
          <form className="flex items-center space-x-2 bg-white text-gray-700 p-2 rounded-md w-full shadow-sm">
            <Search className="h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 outline-none placeholder-gray-400"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-8 items-center font-medium">
          <Link
            href="/"
            className="flex flex-col items-center hover:text-[#FFC72C] transition"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/consortium"
            className="flex flex-col items-center hover:text-[#FFC72C] transition"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Consortium</span>
          </Link>

          <Link
            href="/uploads"
            className="flex flex-col items-center hover:text-[#FFC72C] transition"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs mt-1">Upload</span>
          </Link>

          {/* Admin Link */}
          {/* Uncomment the condition below when you want to restrict to admins only */}
          {/* {user?.isAdmin && ( */}
          <Link
            href="/admin"
            className="flex flex-col items-center hover:text-[#FFC72C] transition"
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
          {/* )} */}

          {/* User Info */}
          {user && (
            <div className="ml-6 flex items-center space-x-2">
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-[#FFC72C]"
              />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
