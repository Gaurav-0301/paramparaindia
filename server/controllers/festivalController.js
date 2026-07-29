const FestivalConfig = require('../models/FestivalConfig');
const { convertBase64ToUrl } = require('../utils/imageSanitizer');

const FESTIVAL_PRESETS = {
  'raksha-bandhan': {
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
  },
  'diwali': {
    festivalKey: 'diwali',
    title: 'Diwali — Festival of Lights',
    tagline: 'Illuminate Every Home with Royal Prosperity & Joy',
    heroHeadline: 'Gilded Brass Diyas & Artisanal Dry Fruit Hampers',
    heroSubheadline: 'Handcrafted Meenakari diyas, organic saffron sweets, sterling silver coins, and regal gift boxes for corporate & festive gifting.',
    storyTitle: 'The Radiant Light of Deepavali',
    storyNarrative: `Diwali celebrates the triumph of light over darkness and knowledge over ignorance. At Parampara India, our Deepavali edition presents hand-carved brass thalis, pure saffron almond sweets, and hallmarked silver keepsakes designed to illuminate your home and relationships with warmth and divine grace.`,
    bannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1600&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?w=1000&auto=format&fit=crop&q=80',
    countdownTargetDate: new Date('2026-11-08T00:00:00.000Z'),
    isActive: false
  },
  'karwa-chauth': {
    festivalKey: 'karwa-chauth',
    title: 'Karwa Chauth',
    tagline: 'Vows of Devotion & Lifelong Companionship',
    heroHeadline: 'Embellished Thali Sets & Gourmet Sargi Hampers',
    heroSubheadline: 'Hand-painted Meenakari Karwas, velvet thali covers, dry fruit sargi boxes, and 925 sterling silver anklet keepsakes.',
    storyTitle: 'The Sacred Fast of Eternal Love',
    storyNarrative: `Karwa Chauth is an exquisite expression of devotion, companionship, and marital bliss. Celebrate the moonlit evening with our handcrafted Sargi hampers, embellished velvet thali sets, and traditional silver keepsakes.`,
    bannerImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1611591475140-be3e72a2034c?w=1000&auto=format&fit=crop&q=80',
    countdownTargetDate: new Date('2026-10-28T00:00:00.000Z'),
    isActive: false
  },
  'bhai-dooj': {
    festivalKey: 'bhai-dooj',
    title: 'Bhai Dooj',
    tagline: 'Blessed Kumkum Tikka & Sweet Gifting',
    heroHeadline: 'A Sister\'s Heartfelt Blessing & Custom Gifting',
    heroSubheadline: 'Artisanal dry fruit platters, brass tikka thalis, and custom keepsake gifts crafted for your brother.',
    storyTitle: 'The Eternal Sentiment of Bhai Dooj',
    storyNarrative: `Following the festival of lights, Bhai Dooj marks the sacred bond between brothers and sisters through tikka ceremonies, shared feasts, and lifelong blessings.`,
    bannerImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1600&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=1000&auto=format&fit=crop&q=80',
    countdownTargetDate: new Date('2026-11-10T00:00:00.000Z'),
    isActive: false
  },
  'holi': {
    festivalKey: 'holi',
    title: 'Holi — Festival of Colors',
    tagline: 'Vibrant Spring Colors & Gourmet Gujiya Delights',
    heroHeadline: 'Organic Herbal Gulal & Kesar Gujiya Hampers',
    heroSubheadline: 'Celebrate spring with 100% natural flower-based gulal, artisanal mawa gujiya boxes, and festive thandai gift sets.',
    storyTitle: 'Welcoming Spring with Joy & Color',
    storyNarrative: `Holi welcomes the vibrant spirit of spring with joyful colors, festive songs, and traditional sweets. Enjoy our eco-friendly herbal gulal and authentic hand-pressed gujiya delicacies.`,
    bannerImage: 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?w=1600&auto=format&fit=crop&q=80',
    storyImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&auto=format&fit=crop&q=80',
    countdownTargetDate: new Date('2027-03-22T00:00:00.000Z'),
    isActive: false
  }
};

// @desc Get active festival theme config
const getActiveFestival = async (req, res) => {
  try {
    let active = await FestivalConfig.findOne({ isActive: true });
    if (!active) {
      for (const key of Object.keys(FESTIVAL_PRESETS)) {
        await FestivalConfig.findOneAndUpdate(
          { festivalKey: key },
          FESTIVAL_PRESETS[key],
          { upsert: true, returnDocument: 'after' }
        );
      }
      active = await FestivalConfig.findOne({ isActive: true });
    }
    res.status(200).json({ success: true, festival: active || FESTIVAL_PRESETS['raksha-bandhan'] });
  } catch (error) {
    res.status(200).json({ success: true, festival: FESTIVAL_PRESETS['raksha-bandhan'] });
  }
};

// @desc Get all festival themes (Admin)
const getAllFestivals = async (req, res) => {
  try {
    for (const key of Object.keys(FESTIVAL_PRESETS)) {
      const exists = await FestivalConfig.findOne({ festivalKey: key });
      if (!exists) {
        await FestivalConfig.create(FESTIVAL_PRESETS[key]);
      }
    }
    const festivals = await FestivalConfig.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, festivals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Switch or update festival config (Admin)
const switchActiveFestival = async (req, res) => {
  try {
    const { festivalKey } = req.body;
    if (!festivalKey) {
      return res.status(400).json({ message: 'festivalKey is required' });
    }
    
    // Deactivate all themes
    await FestivalConfig.updateMany({}, { isActive: false });

    // Check if preset exists in DB or fallback dictionary
    let target = await FestivalConfig.findOne({ festivalKey });
    const presetData = FESTIVAL_PRESETS[festivalKey] || FESTIVAL_PRESETS['raksha-bandhan'];

    if (!target) {
      target = new FestivalConfig({
        ...presetData,
        ...req.body,
        festivalKey,
        isActive: true
      });
    } else {
      target.isActive = true;
      if (req.body.title) target.title = req.body.title;
      if (req.body.tagline) target.tagline = req.body.tagline;
      if (req.body.heroHeadline) target.heroHeadline = req.body.heroHeadline;
      if (req.body.heroSubheadline) target.heroSubheadline = req.body.heroSubheadline;
      if (req.body.storyTitle) target.storyTitle = req.body.storyTitle;
      if (req.body.storyNarrative) target.storyNarrative = req.body.storyNarrative;
      if (req.body.bannerImage) target.bannerImage = req.body.bannerImage;
      if (req.body.storyImage) target.storyImage = req.body.storyImage;
      if (req.body.countdownTargetDate) target.countdownTargetDate = req.body.countdownTargetDate;
    }

    await target.save();

    console.log(`[FESTIVAL ENGINE] Successfully activated festival theme: "${target.title}" (${target.festivalKey})`);

    res.status(200).json({
      success: true,
      festival: target,
      message: `Active festival theme switched to ${target.title}`
    });
  } catch (error) {
    console.error('Failed to switch festival theme:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Save or edit festival theme details (Admin)
const updateFestivalTheme = async (req, res) => {
  try {
    const {
      festivalKey,
      title,
      tagline,
      heroHeadline,
      heroSubheadline,
      storyTitle,
      storyNarrative,
      bannerImage,
      storyImage,
      countdownTargetDate,
      makeActive
    } = req.body;

    if (!festivalKey || !title) {
      return res.status(400).json({ message: 'festivalKey and title are required' });
    }

    if (makeActive) {
      await FestivalConfig.updateMany({}, { isActive: false });
    }

    let festival = await FestivalConfig.findOne({ festivalKey });

    const cleanedBanner = convertBase64ToUrl(bannerImage);
    const cleanedStory = convertBase64ToUrl(storyImage);

    if (!festival) {
      festival = new FestivalConfig({
        festivalKey,
        title,
        tagline: tagline || '',
        heroHeadline: heroHeadline || '',
        heroSubheadline: heroSubheadline || '',
        storyTitle: storyTitle || '',
        storyNarrative: storyNarrative || '',
        bannerImage: cleanedBanner || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=1600&auto=format&fit=crop&q=80',
        storyImage: cleanedStory || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80',
        countdownTargetDate: countdownTargetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: makeActive !== undefined ? Boolean(makeActive) : false
      });
    } else {
      if (title) festival.title = title;
      if (tagline !== undefined) festival.tagline = tagline;
      if (heroHeadline !== undefined) festival.heroHeadline = heroHeadline;
      if (heroSubheadline !== undefined) festival.heroSubheadline = heroSubheadline;
      if (storyTitle !== undefined) festival.storyTitle = storyTitle;
      if (storyNarrative !== undefined) festival.storyNarrative = storyNarrative;
      if (cleanedBanner) festival.bannerImage = cleanedBanner;
      if (cleanedStory) festival.storyImage = cleanedStory;
      if (countdownTargetDate !== undefined) festival.countdownTargetDate = countdownTargetDate;
      if (makeActive) festival.isActive = true;
    }

    await festival.save();

    res.status(200).json({
      success: true,
      festival,
      message: `Theme "${festival.title}" saved successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveFestival,
  getAllFestivals,
  switchActiveFestival,
  updateFestivalTheme
};
