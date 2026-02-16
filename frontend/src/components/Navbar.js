'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiBookmark, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navLinks = [
    { href: '/notes', label: 'Notes', icon: FiFileText },
    { href: '/bookmarks', label: 'Bookmarks', icon: FiBookmark },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/notes" className="text-xl font-bold text-primary-600">
              NoteMark
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="w-4 h-4 mr-2" />
              {user.name}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center px-4 py-2 text-xs font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
