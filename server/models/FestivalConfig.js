const mongoose = require('mongoose');

const festivalConfigSchema = new mongoose.Schema({
  festivalKey: { type: String, required: true, unique: true }, // e.g., 'raksha-bandhan', 'diwali', 'holi'
  title: { type: String, required: true }, // e.g. 'Raksha Bandhan'
  tagline: { type: String, required: true }, // e.g. 'Celebrate the Eternal Sibling Bond'
  heroHeadline: { type: String, required: true },
  heroSubheadline: { type: String, required: true },
  storyTitle: { type: String, required: true },
  storyNarrative: { type: String, required: true }, // Full rich storytelling text
  bannerImage: { type: String, required: true },
  storyImage: { type: String, required: true },
  countdownTargetDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FestivalConfig', festivalConfigSchema);
