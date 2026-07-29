const FestivalConfig = require('../models/FestivalConfig');

// Default Raksha Bandhan fallback config
const DEFAULT_FESTIVAL = {
  festivalKey: 'raksha-bandhan',
  title: 'Raksha Bandhan',
  tagline: 'A Sacred Thread of Eternal Bond & Love',
  heroHeadline: 'Celebrate the Pure Sentiment of Sisterhood & Protection',
  heroSubheadline: 'Handcrafted premium Rakhis, curated mithai hampers, and timeless keepsake jewelry delivered directly to your loved ones.',
  storyTitle: 'The Story & Sacred Sentiment of Raksha Bandhan',
  storyNarrative: `Raksha Bandhan is more than a tradition; it is an emotional promise wrapped in silk and gold. Originating from ancient Vedic heritage, the sacred thread (Rakhi) symbolizes a sister's heartfelt prayers for her brother's longevity and prosperity, and a brother's silent pledge to stand as her eternal protector. At Parampara India, we craft each piece with reverence for this timeless memory — pairing artisan craftsmanship with soft-luxury elegance so your bond transcends distance.`,
  bannerImage: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1600&auto=format&fit=crop&q=80',
  storyImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80',
  countdownTargetDate: new Date('2026-08-28T00:00:00.000Z'),
  isActive: true
};

// @desc Get active festival theme config
// @route GET /api/festival/active
const getActiveFestival = async (req, res) => {
  try {
    let active = await FestivalConfig.findOne({ isActive: true });
    if (!active) {
      active = await FestivalConfig.create(DEFAULT_FESTIVAL);
    }
    res.status(200).json({ success: true, festival: active });
  } catch (error) {
    res.status(200).json({ success: true, festival: DEFAULT_FESTIVAL });
  }
};

// @desc Get all festival themes (Admin)
// @route GET /api/festival/admin/all
const getAllFestivals = async (req, res) => {
  try {
    const festivals = await FestivalConfig.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, festivals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Switch or update festival config (Admin)
// @route POST /api/festival/admin/switch
const switchActiveFestival = async (req, res) => {
  try {
    const { festivalKey } = req.body;
    
    // Deactivate all
    await FestivalConfig.updateMany({}, { isActive: false });

    let target = await FestivalConfig.findOne({ festivalKey });
    if (!target) {
      target = new FestivalConfig({ ...req.body, isActive: true });
    } else {
      target.isActive = true;
      if (req.body.title) target.title = req.body.title;
      if (req.body.storyNarrative) target.storyNarrative = req.body.storyNarrative;
      if (req.body.countdownTargetDate) target.countdownTargetDate = req.body.countdownTargetDate;
    }

    await target.save();
    res.status(200).json({ success: true, festival: target, message: `Switched active festival to ${target.title}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveFestival,
  getAllFestivals,
  switchActiveFestival
};
