"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Home,
  Search,
  Upload,
  Shield,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    image: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 bg-[#002855] text-white z-50 shadow-md">
      <div className="flex items-center p-4 max-w-[1280px] mx-auto justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/merrimack-logo.png"
            alt="Merrimack College Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Search Bar (desktop only) */}
        <div className="hidden lg:flex flex-1 mx-6">
          <form className="flex items-center space-x-2 bg-white text-gray-700 p-2 rounded-md w-full shadow-sm">
            <Search className="h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 outline-none placeholder-gray-400"
            />
          </form>
        </div>

        {/* Desktop Nav (only visible ≥ lg) */}
        <nav className="hidden lg:flex space-x-8 items-center font-medium">
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
          <Link
            href="/admin"
            className="flex flex-col items-center hover:text-[#FFC72C] transition"
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs mt-1">Admin</span>
          </Link>

          {/* User Info */}
          {user && (
            <div className="ml-6 relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 hover:text-[#FFC72C] transition"
              >
                <Image
                  src={user.image}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-[#FFC72C]"
                />
                <span className="text-sm font-semibold">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-[#002855] rounded-lg shadow-lg border border-gray-200">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#FFC72C] hover:text-white rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Hamburger button (only visible < lg) */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <Menu className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu (only visible when hamburger open) */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#002855] text-white px-6 pb-4 space-y-4">
          <form className="flex items-center space-x-2 bg-white text-gray-700 p-2 rounded-md w-full shadow-sm">
            <Search className="h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent flex-1 outline-none placeholder-gray-400"
            />
          </form>

          <Link href="/" className="block hover:text-[#FFC72C] transition">
            Home
          </Link>
          <Link
            href="/consortium"
            className="block hover:text-[#FFC72C] transition"
          >
            Consortium
          </Link>
          <Link
            href="/uploads"
            className="block hover:text-[#FFC72C] transition"
          >
            Upload
          </Link>
          <Link href="/admin" className="block hover:text-[#FFC72C] transition">
            Admin
          </Link>

          {user && (
            <div className="mt-4">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full text-left px-4 py-2 bg-[#FFC72C] text-[#002855] rounded-lg font-semibold hover:bg-[#e0b020] transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-[#002855] mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-md bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855] transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
