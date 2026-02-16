'use client';

import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite, onTagClick }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{note.title}</h3>
        <button
          onClick={() => onToggleFavorite(note._id)}
          className={`p-1.5 rounded-lg transition-colors ${
            note.isFavorite
              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
          }`}
        >
          <FiStar className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick && onTagClick(tag)}
              className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {tag}
            </button>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{formatDate(note.updatedAt)}</span>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
