'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FiFileText, FiBookmark, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/notes');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          NoteMark
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A simple and elegant way to manage your notes and bookmarks
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            Sign In
            <FiArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            Create Account
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
              <FiFileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-600 text-sm">
              Create, organize, and search your notes with ease. Add tags and mark favorites.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
              <FiBookmark className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bookmarks</h3>
            <p className="text-gray-600 text-sm">
              Save and organize your favorite links. Auto-fetch titles and descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
