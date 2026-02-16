'use client';

import { FiEdit2, FiTrash2, FiStar, FiExternalLink } from 'react-icons/fi';

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite, onTagClick }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDomain = (url) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {bookmark.title || bookmark.url}
          </h3>
          <a
            href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mt-1"
          >
            {getDomain(bookmark.url)}
            <FiExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
        <button
          onClick={() => onToggleFavorite(bookmark._id)}
          className={`p-1.5 rounded-lg transition-colors ${
            bookmark.isFavorite
              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
          }`}
        >
          <FiStar className={`w-4 h-4 ${bookmark.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      {bookmark.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{bookmark.description}</p>
      )}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bookmark.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {tag}
            </button>
          ))}
          {bookmark.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500">
              +{bookmark.tags.length - 3}
            </span>
          )}
        </div>
      )}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{formatDate(bookmark.updatedAt)}</span>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(bookmark)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(bookmark._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
