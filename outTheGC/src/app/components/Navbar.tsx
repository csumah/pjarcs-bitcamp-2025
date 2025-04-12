'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiHome } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi";
import { HiCalendar } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";

const navItems = [
  { icon: HiHome, href: '/homepage', label: 'Home' },
  { icon: HiUserGroup, href: '#', label: 'Groups' },
  { icon: HiCalendar, href: '#', label: 'Events' },
  { icon: HiPlus, href: '#', label: 'Create' }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 md:w-20 bg-[#F4A460] flex flex-col items-center py-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative w-12 h-12 mb-6 flex items-center justify-center rounded-full
              transition-all duration-200 group
              ${isActive ? 'bg-white shadow-lg' : 'hover:bg-white/10'}
            `}
          >
            <item.icon 
              className={`text-2xl ${isActive ? 'text-[#F4A460]' : 'text-white'}`}
              size={24}
            />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-2 py-1 bg-white rounded-md text-[#F4A460] text-sm font-medium
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {item.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full transform -translate-x-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}