import React from "react";
import Image from "next/image";
import Link from "next/link"; // <-- correct Link
import { BookOpenIcon, HomeIcon, SearchIcon } from "lucide-react";

function Header() {
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
      <div className="flex space-x-6">
        {/* Home link */}
        <Link href="/">
          <div className="flex flex-col items-center icon cursor-pointer">
            <HomeIcon className="h-5 w-5" />
            <span className="text-sm mt-1">Home</span>
          </div>
        </Link>

        {/* Research link */}
        <Link href="/research">
          <div className="flex flex-col items-center icon cursor-pointer">
            <BookOpenIcon className="h-5 w-5" />
            <span className="text-sm mt-1">Consortium</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
