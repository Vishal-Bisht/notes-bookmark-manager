import express from 'express';
import { body } from 'express-validator';
import { 
  getNotes, 
  getNote, 
  createNote, 
  updateNote, 
  deleteNote,
  toggleFavorite 
} from '../controllers/notesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const noteValidation = [
  body('title', 'Title is required').notEmpty().trim(),
  body('content', 'Content is required').notEmpty()
];

const updateNoteValidation = [
  body('title', 'Title is required').optional().notEmpty().trim(),
  body('content', 'Content is required').optional().notEmpty()
];

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getNotes)
  .post(noteValidation, createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNoteValidation, updateNote)
  .delete(deleteNote);

router.put('/:id/favorite', toggleFavorite);

export default router;
