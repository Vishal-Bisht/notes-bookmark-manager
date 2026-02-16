import Bookmark from '../models/Bookmark.js';
import { validationResult } from 'express-validator';
import { fetchUrlTitle, fetchUrlDescription } from '../utils/urlFetcher.js';

// @desc    Get all bookmarks for user
// @route   GET /api/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
  try {
    const { q, tags, favorite } = req.query;
    let query = { user: req.user.id };

    // Search by text
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Filter by favorite
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    const bookmarks = await Bookmark.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single bookmark
// @route   GET /api/bookmarks/:id
// @access  Private
export const getBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    // Make sure user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this bookmark'
      });
    }

    res.status(200).json({
      success: true,
      data: bookmark
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new bookmark
// @route   POST /api/bookmarks
// @access  Private
export const createBookmark = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let { url, title, description, tags, isFavorite } = req.body;

    // Auto-fetch title if not provided (Bonus feature)
    if (!title || title.trim() === '') {
      const fetchedTitle = await fetchUrlTitle(url);
      title = fetchedTitle || url;
    }

    // Auto-fetch description if not provided
    if (!description || description.trim() === '') {
      const fetchedDescription = await fetchUrlDescription(url);
      description = fetchedDescription || '';
    }

    const bookmark = await Bookmark.create({
      url,
      title,
      description,
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
export const updateBookmark = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    // Make sure user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this bookmark'
      });
    }

    const { url, title, description, tags, isFavorite } = req.body;

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { 
        url, 
        title, 
        description, 
        tags, 
        isFavorite,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: bookmark
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    // Make sure user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this bookmark'
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Toggle favorite status
// @route   PUT /api/bookmarks/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    // Make sure user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this bookmark'
      });
    }

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { isFavorite: !bookmark.isFavorite, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: bookmark
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Fetch URL metadata
// @route   POST /api/bookmarks/fetch-metadata
// @access  Private
export const fetchMetadata = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a URL'
      });
    }

    const title = await fetchUrlTitle(url);
    const description = await fetchUrlDescription(url);

    res.status(200).json({
      success: true,
      data: {
        title: title || '',
        description: description || ''
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata'
    });
  }
};
