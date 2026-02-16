"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, backendUrl } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiStar, FiTag, FiX } from "react-icons/fi";
import BookmarkCard from "@/components/BookmarkCard";
import BookmarkForm from "@/components/BookmarkForm";
import Modal from "@/components/Modal";
import SearchBar from "@/components/SearchBar";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user, search, showFavorites, selectedTag]);

  useEffect(() => {
    if (user) {
      fetchAllTags();
    }
  }, [user]);

  const fetchAllTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(backendUrl + "/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const tags = [
          ...new Set(data.data.flatMap((bookmark) => bookmark.tags || [])),
        ];
        setAllTags(tags.sort());
      }
    } catch (error) {
      console.error("Failed to fetch tags");
    }
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = "/api/bookmarks?";
      if (search) endpoint += `q=${encodeURIComponent(search)}&`;
      if (showFavorites) endpoint += "favorite=true&";
      if (selectedTag) endpoint += `tags=${encodeURIComponent(selectedTag)}&`;

      const { data } = await axios.get(backendUrl + endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookmarks(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bookmarks");
    }
    setLoading(false);
  };

  const handleCreate = async (bookmarkData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        backendUrl + "/api/bookmarks",
        bookmarkData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        toast.success("Bookmark created");
        setIsModalOpen(false);
        fetchBookmarks();
        fetchAllTags();
      } else {
        toast.error(data.error || "Failed to create bookmark");
      }
    } catch (error) {
      toast.error("Failed to create bookmark");
    }
  };

  const handleUpdate = async (bookmarkData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        backendUrl + `/api/bookmarks/${editingBookmark._id}`,
        bookmarkData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        toast.success("Bookmark updated");
        setIsModalOpen(false);
        setEditingBookmark(null);
        fetchBookmarks();
        fetchAllTags();
      } else {
        toast.error(data.error || "Failed to update bookmark");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(backendUrl + `/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Bookmark deleted");
        fetchBookmarks();
        fetchAllTags();
      } else {
        toast.error(data.error || "Failed to delete bookmark");
      }
    } catch (error) {
      toast.error("Failed to delete bookmark");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        backendUrl + `/api/bookmarks/${id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        fetchBookmarks();
      }
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const openEditModal = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          New Bookmark
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search bookmarks..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              showFavorites
                ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FiStar
              className={`w-4 h-4 mr-2 ${showFavorites ? "fill-current" : ""}`}
            />
            Favorites
          </button>
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`appearance-none pl-9 pr-8 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                selectedTag
                  ? "text-primary-700 bg-primary-100 hover:bg-primary-200"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {(selectedTag || showFavorites) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {showFavorites && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
              Favorites
              <button
                onClick={() => setShowFavorites(false)}
                className="ml-2 hover:text-yellow-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
              Tag: {selectedTag}
              <button
                onClick={() => setSelectedTag("")}
                className="ml-2 hover:text-primary-900"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {search || showFavorites || selectedTag
              ? "No bookmarks found"
              : "No bookmarks yet. Add your first bookmark!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onTagClick={setSelectedTag}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBookmark ? "Edit Bookmark" : "New Bookmark"}
      >
        <BookmarkForm
          bookmark={editingBookmark}
          onSubmit={editingBookmark ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
