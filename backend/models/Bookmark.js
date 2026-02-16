import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please add a URL'],
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please add a valid URL'
    ]
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
    default: ''
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before save
BookmarkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search
BookmarkSchema.index({ title: 'text', description: 'text', url: 'text', tags: 'text' });

export default mongoose.model('Bookmark', BookmarkSchema);
