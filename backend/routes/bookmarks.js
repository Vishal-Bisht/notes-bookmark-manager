import express from 'express';
import { body } from 'express-validator';
import { 
  getBookmarks, 
  getBookmark, 
  createBookmark, 
  updateBookmark, 
  deleteBookmark,
  toggleFavorite,
  fetchMetadata 
} from '../controllers/bookmarksController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const bookmarkValidation = [
  body('url', 'URL is required').notEmpty().trim(),
  body('url', 'Please provide a valid URL').isURL({
    require_protocol: false,
    require_valid_protocol: true
  })
];

const updateBookmarkValidation = [
  body('url', 'URL is required').optional().notEmpty().trim(),
  body('url', 'Please provide a valid URL').optional().isURL({
    require_protocol: false,
    require_valid_protocol: true
  })
];

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getBookmarks)
  .post(bookmarkValidation, createBookmark);

router.post('/fetch-metadata', fetchMetadata);

router.route('/:id')
  .get(getBookmark)
  .put(updateBookmarkValidation, updateBookmark)
  .delete(deleteBookmark);

router.put('/:id/favorite', toggleFavorite);

export default router;
